import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const clientType = req.headers['x-client-type']?.toString().toLowerCase();
    let refreshToken: string;

    if (clientType === 'mobile') {
      refreshToken = req.body.refreshToken;
    } else {
      refreshToken = req.cookies['refreshToken'];
    }

    if (!refreshToken) {
      throw new UnauthorizedException('no refresh token provided');
    }

    const tokenEntity =
      await this.authService.validateRefreshToken(refreshToken);
    if (!tokenEntity || !tokenEntity.user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    req.user = tokenEntity.user;
    req.refreshToken = refreshToken;
    return true;
  }
}
