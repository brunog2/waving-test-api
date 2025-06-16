import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement find all users logic
  }

  async findOne(id: string) {
    // TODO: Implement find one user logic
  }

  async update(id: string, updateDto: any) {
    // TODO: Implement update user logic
  }

  async remove(id: string) {
    // TODO: Implement remove user logic
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
}
