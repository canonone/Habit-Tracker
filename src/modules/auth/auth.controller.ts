import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '../user/dtos/create-user.dto';
import LoginDto from '../user/dtos/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.authService.register(userDto);
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return req.user;
  }
}
