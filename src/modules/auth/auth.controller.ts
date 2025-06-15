import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '../user/dtos/create-user.dto';
import LoginDto from '../user/dtos/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.authService.createUser(userDto);
    const { password, ...result } = user;
    return {
      status: 'successful',
      message: 'User account Created Successfully',
      data: { ...result },
    };
  }

  @Post('/login')
  async userLogin(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }
}
