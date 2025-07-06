import { Controller, Post, Get, Body, Param, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '../user/dtos/create-user.dto';
import LoginDto from '../user/dtos/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { updatePassword } from './interface/utility-interface';
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
  async googleAuthRedirect(@Req() req) {
    const user = await this.authService.googleSignup(req.user);
    return {
      status: 'successful',
      message: 'user account created successfully via google',
      data: user,
    };
  }

  @Put('forgotPassword/:id')
  async forgotPassword(@Body() body: updatePassword, @Param('id') id: string) {
    const user = await this.authService.forgotPassword(id, body);
    return {
      status: 'successful',
      message: 'user password updated successfully',
    };
  }
}
