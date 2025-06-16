import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.interface';
import { UserInterface } from '../interfaces/user.interface';
import { jwtConfig } from '../jwt-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret!,
    });
  }

  async validate(payload: JwtPayload): Promise<UserInterface> {
    return {
      createdAt: payload.createdAt,
      name: payload.name,
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
