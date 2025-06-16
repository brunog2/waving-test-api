import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoriesDto, SortField } from './dto/find-all-categories.dto';
import { FindAllCategoriesWithProductsDto } from './dto/find-all-categories-with-products.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FindAllCategoriesDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};

    switch (filters.sortBy) {
      case SortField.NAME:
        orderBy.name = filters.sortOrder;
        break;
      default:
        orderBy.createdAt = filters.sortOrder;
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: categories,
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
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Categoria não encontrada',
        error: 'Not Found',
      });
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: 404,
            message: 'Categoria não encontrada',
            error: 'Not Found',
          });
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: 404,
            message: 'Categoria não encontrada',
            error: 'Not Found',
          });
        }
      }
      throw error;
    }
  }

  async findAllWithProducts(filters: FindAllCategoriesWithProductsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          products: {
            take: 10,
            where: {
              available: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      }),
      this.prisma.category.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: categories,
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
}
