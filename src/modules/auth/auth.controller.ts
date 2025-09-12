import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Put,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '../user/dtos/create-user.dto';
import LoginDto from '../user/dtos/user-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { updatePassword } from './interface/utility-interface';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/register')
  async register(@Body() userDto: CreateUserDto) {
    const check = await this.authService.register(userDto);
    return check;
  }

  @Post('/login')
  async userLogin(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);
    const { accessToken, refreshToken } =
      await this.authService.generateToken(user);
    const clientType = req.headers['x-client-type']?.toString().toLowerCase();

    if (clientType === 'mobile') {
      return { accessToken, refreshToken };
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRATION', '7d'),
      ),
    });

    return { accessToken };
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

  @Post()
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request) {
    // Assuming the refresh token is stored in cookies
    const refreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.headers['authorization']?.replace('Bearer ', '');

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    return { accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      req.headers['authorization']?.replace('Bearer ', '');

    await this.authService.invalidateRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
