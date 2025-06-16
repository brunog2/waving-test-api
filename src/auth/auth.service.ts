import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async customerLogin(loginDto: LoginDto) {
    // TODO: Implement customer login logic
  }

  async customerRegister(registerDto: CreateUserDto) {
    // TODO: Implement customer registration logic
  }

  async adminLogin(loginDto: any) {
    // TODO: Implement admin login logic
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
