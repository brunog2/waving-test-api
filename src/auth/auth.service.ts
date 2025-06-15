import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from 'src/dto/auth/login.dto';
import { CreateUserDto } from 'src/dto/auth/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async customerLogin(loginDto: LoginDto) {
    // TODO: Implement customer login logic
  }

  async customerRegister(registerDto: CreateUserDto) {
    // TODO: Implement customer registration logic
  }

  async adminLogin(loginDto: any) {
    // TODO: Implement admin login logic
  }
}
