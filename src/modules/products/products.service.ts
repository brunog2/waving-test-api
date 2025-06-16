import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductInterface } from './interfaces/product.interface';
import { AdminGuard } from '../auth/guards/admin.guard';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        available: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
  @UseGuards(AdminGuard)
  async create(createDto: any) {
    // TODO: Implement create product logic
  }

  @UseGuards(AdminGuard)
  async update(id: string, updateDto: any) {
    // TODO: Implement update product logic
  }

  @UseGuards(AdminGuard)
  async remove(id: string) {
    // TODO: Implement remove product logic
  }
}
