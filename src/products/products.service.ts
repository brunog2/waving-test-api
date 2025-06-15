import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement find all products logic
  }

  async findOne(id: string) {
    // TODO: Implement find one product logic
  }

  async create(createDto: any) {
    // TODO: Implement create product logic
  }

  async update(id: string, updateDto: any) {
    // TODO: Implement update product logic
  }

  async remove(id: string) {
    // TODO: Implement remove product logic
  }
}
