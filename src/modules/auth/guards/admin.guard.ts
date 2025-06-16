import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from '@prisma/client';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primeiro verifica se o token JWT é válido
    const isJwtValid = await super.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    // Se o JWT é válido, pega o usuário da requisição
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verifica se o usuário tem a role de ADMIN
    return user?.role === Role.ADMIN;
  }
}
