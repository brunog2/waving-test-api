import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET,
  signOptions: { expiresIn: '30d' },
};
