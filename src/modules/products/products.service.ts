import { Injectable, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FindAllProductsDto } from './dto/find-all-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FindAllProductsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (filters.categoryId) where.categoryId = filters.categoryId;

    if (filters.available !== undefined) where.available = filters.available;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined)
        where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined)
        where.price.lte = Number(filters.maxPrice);
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
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
