import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import LoginDto from '../user/dtos/user-login.dto';
import * as SYS_MSG from '../../utils/system-messages';
import * as bcrypt from 'bcryptjs';
import CreateUserDto from '../user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { GenerateToken } from './interface/utility-interface';
import { hash } from 'bcryptjs';
import { updatePassword } from './interface/utility-interface';
import UpdateUSerDto from '../user/dtos/update-user.dto';
import { googleAuth } from './interface/utility-interface';
import { AuthProvider } from '../user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
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

  private generateToken(payload: GenerateToken) {
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException(SYS_MSG.USER_ALREADY_EXIST);
    }
    const hashedPassword = await hash(password, 10);
    createUserDto.password = hashedPassword;
    return this.userService.createUser(createUserDto);
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const { password, ...result } = user;
    const payload = { sub: user.id, email: user.email };
    const token = this.generateToken(payload);
    const userPayload = {
      status: 'successful',
      message: 'User logged in successfully',
      token: token,
      data: { ...result },
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
      throw new Error('user already exist');
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
}
