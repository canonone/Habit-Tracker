import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import * as ExtractJwt from 'passport-jwt/lib/extract_jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret: string =
      configService.get<string>('JWT_SECRET') ?? 'defaultSecretKey';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
