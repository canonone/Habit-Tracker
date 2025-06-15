import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import LoginDto from '../user/dtos/user-login.dto';
import * as SYS_MSG from '../../utils/system-messages';
import * as bcrypt from 'bcryptjs';
import { hash } from 'bcryptjs';
import CreateUserDto from '../user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { GenerateToken } from './interface/token-interface';

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
    const { sub, email } = payload;
    return this.jwtService.sign(payload);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException(SYS_MSG.USER_ALREADY_EXIST);
    }
    const hashedPassword = await hash(password, 10);
    const userPayload = {
      email,
      password: hashedPassword,
    };
    return this.userService.createUser(userPayload);
  }

  async loginUser(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const { password, ...result } = user;
    const payload = { sub: user.id, email: user.email };
    // const token = this.jwtService.sign(payload);
    const token = this.generateToken(payload);
    const userPayload = {
      status: 'successful',
      message: 'User logged in successfully',
      token: token,
      data: { ...result },
    };
    return userPayload;
  }
}
