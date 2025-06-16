import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== Role.CUSTOMER) {
      throw new ForbiddenException(
        'Apenas clientes podem acessar este recurso',
      );
    }

    return true;
  }
}
