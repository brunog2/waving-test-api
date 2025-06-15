import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async customerLogin(loginDto: any) {
    // TODO: Implement customer login logic
  }

  async customerRegister(registerDto: any) {
    // TODO: Implement customer registration logic
  }

  async adminLogin(loginDto: any) {
    // TODO: Implement admin login logic
  }
}
