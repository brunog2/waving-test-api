import { JwtModuleOptions } from '@nestjs/jwt';

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '30d' },
};
