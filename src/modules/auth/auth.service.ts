import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as SYS_MSG from '../../utils/system-messages';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { updatePassword } from './interface/utility-interface';
import { googleAuth } from './interface/utility-interface';
import { AuthProvider } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import ms from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private configService: ConfigService,
  ) {}

  async validateUser(login: Partial<User>) {
    const { email, password } = login;
    if (!email || !password) {
      throw new BadRequestException('Email or password is required');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(SYS_MSG.INVALID_LOGIN_CREDENTIALS);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException(SYS_MSG.INVALID_LOGIN_CREDENTIALS);
    }
    return user;
  }

  async generateToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = uuidv4();
    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );

    const refreshTokenEntity = await this.refreshTokenRepo.create({
      token: await bcrypt.hash(refreshToken, 10),
      user,
      expireDate: new Date(Date.now() + ms(expiresIn)),
    });
    await this.refreshTokenRepo.save(refreshTokenEntity);
    return { accessToken, refreshToken };
  }

  async register(createUser: Partial<User>) {
    const { email, password } = createUser;
    if (!email || !password) {
      throw new BadRequestException('Email or password cannot be empty');
    }
    let user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException(SYS_MSG.USER_ALREADY_EXIST);
    }
    const hashedPassword = await hash(password, 10);
    createUser.password = hashedPassword;
    let newUser = await this.userService.createUser(createUser);
    user = newUser;
    const { accessToken } = await this.generateToken(user);
    const { password: check, ...result } = user;
    return {
      status: 'successful',
      message: 'User account creatd successfully',
      token: accessToken,
      user: { ...result },
    };
  }

  async loginUser(login: Partial<User>) {
    const user = await this.validateUser(login);
    const { password, ...result } = user;
    const { accessToken, refreshToken } = await this.generateToken(user);
    const userPayload = {
      status: 'successful',
      message: 'User logged in successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { ...result },
    };
    return userPayload;
  }

  async googleSignup(body: googleAuth) {
    const { email } = body;
    if (!email) {
      throw new BadRequestException('email does not exist');
    }
    const check = await this.userService.findByEmail(email);
    if (check) {
      throw new BadRequestException('user already exist');
    }
    const fullName = `${body.firstName} ${body.lastName}`;
    const payload = {
      fullName: fullName,
      email: email,
      provider: 'google' as AuthProvider,
    };
    const user = await this.userService.createUser(payload);
  }

  async forgotPassword(id: string, body: updatePassword) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    const extinguisher = await bcrypt.compare(body.password, user.password);
    if (!extinguisher) {
      throw new BadRequestException('incorrect password');
    }
    const hashedPassword = await hash(body.newPassword, 10);
    const payload = {
      password: hashedPassword,
    };
    return this.userService.updateUser(id, payload);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const tokenEntity = await this.validateRefreshToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('invalid or expired refresh token');
    }

    const payload = { sub: tokenEntity.user.id, email: tokenEntity.user.email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshTokenRepo.delete({ token: refreshToken });
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    const tokenEntity = await this.refreshTokenRepo.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.expireDate < new Date()) {
      throw new UnauthorizedException('invalid or expired refresh token');
    }
    const isValid = await bcrypt.compare(refreshToken, tokenEntity.token);
    if (!isValid) {
      throw new UnauthorizedException('invalid refresh token');
    }
    return tokenEntity;
  }
}
