import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement find all categories logic
  }

  async create(createDto: any) {
    // TODO: Implement create category logic
  }

  async update(id: string, updateDto: any) {
    // TODO: Implement update category logic
  }

  async remove(id: string) {
    // TODO: Implement remove category logic
  }
}
