import { Injectable, UseGuards, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FindAllProductsDto, SortField } from './dto/find-all-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FindAllProductsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters.categoryId) where.categoryId = filters.categoryId;

    if (filters.available !== undefined) {
      where.available =
        filters.available === 'true' || filters.available === true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined)
        where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined)
        where.price.lte = Number(filters.maxPrice);
    }

    // Configura a ordenação
    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [
      { available: 'desc' },
    ];

    switch (filters.sortBy) {
      case SortField.PRICE:
        orderBy.push({ price: filters.sortOrder });
        break;
      case SortField.NAME:
        orderBy.push({ name: filters.sortOrder });
        break;
      default:
        orderBy.push({ createdAt: filters.sortOrder });
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy,
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
    return await this.prisma.product.findFirst({
      where: { id },
      include: {
        category: true,
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
    const product = await this.prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
