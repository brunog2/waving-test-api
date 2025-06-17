import { Injectable, UseGuards, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FindAllProductsDto, SortField } from './dto/find-all-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  }

  async findAll(filters: FindAllProductsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    let where: Prisma.ProductWhereInput = {};

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

    let products;
    let total;

    if (filters.search) {
      // Use raw query with unaccent for search
      const sortOrder = filters.sortOrder || 'desc';

      // Construir parâmetros dinamicamente
      const queryParams: (string | number)[] = [`%${filters.search}%`];
      let paramIndex = 2;

      const buildWhereClause = () => {
        let whereClause = 'WHERE unaccent(p.name) ILIKE unaccent($1)';

        if (filters.categoryId) {
          whereClause += ` AND p."category_id" = $${paramIndex}`;
          queryParams.push(filters.categoryId);
          paramIndex++;
        }

        if (filters.available !== undefined) {
          whereClause += ` AND p.available = $${paramIndex}`;
          queryParams.push(String(filters.available));
          paramIndex++;
        }

        if (filters.minPrice !== undefined) {
          whereClause += ` AND p.price >= $${paramIndex}`;
          queryParams.push(Number(filters.minPrice));
          paramIndex++;
        }

        if (filters.maxPrice !== undefined) {
          whereClause += ` AND p.price <= $${paramIndex}`;
          queryParams.push(Number(filters.maxPrice));
          paramIndex++;
        }

        return whereClause;
      };

      const whereClause = buildWhereClause();

      const searchQuery = `
        SELECT 
          p.id,
          p.name,
          p.description,
          p.price,
          p."image_url" as "imageUrl",
          p.available,
          p."category_id" as "categoryId",
          p."created_at" as "createdAt",
          p."updated_at" as "updatedAt",
          p."deleted_at" as "deletedAt",
          c.id as "category.id",
          c.name as "category.name",
          c.description as "category.description",
          c."created_at" as "category.createdAt",
          c."updated_at" as "category.updatedAt",
          c."deleted_at" as "category.deletedAt"
        FROM "products" p
        LEFT JOIN "categories" c ON p."category_id" = c.id
        ${whereClause}
        ORDER BY p.available DESC, p."created_at" ${sortOrder}
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      const countQuery = `
        SELECT COUNT(*)
        FROM "products" p
        ${whereClause}
      `;

      try {
        [products, total] = await Promise.all([
          this.prisma.$queryRawUnsafe(searchQuery, ...queryParams),
          this.prisma.$queryRawUnsafe(countQuery, ...queryParams),
        ]);

        // Get comments for the products
        const productIds = products.map((p: any) => p.id);
        const comments = await this.prisma.comment.findMany({
          where: {
            productId: { in: productIds },
          },
          select: {
            productId: true,
            rating: true,
          },
        });

        // Calculate ratings and format the response
        products = products.map((product: any) => {
          const productComments = comments.filter(
            (c) => c.productId === product.id,
          );
          const ratings = productComments.map((c) => c.rating);
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
              : 0;

          // Format the category object
          const category = {
            id: product['category.id'],
            name: product['category.name'],
            description: product['category.description'],
            createdAt: product['category.createdAt'],
            updatedAt: product['category.updatedAt'],
            deletedAt: product['category.deletedAt'],
          };

          // Remove category fields from product
          const {
            'category.id': _,
            'category.name': __,
            'category.description': ___,
            'category.createdAt': ____,
            'category.updatedAt': _____,
            'category.deletedAt': ______,
            ...productWithoutCategory
          } = product;

          return {
            ...productWithoutCategory,
            category,
            averageRating: Number(averageRating.toFixed(1)),
            totalRatings: ratings.length,
          };
        });

        total = Number(total[0].count);
      } catch (error) {
        console.error('Error executing search query:', error);
        throw error;
      }
    } else {
      // Use regular Prisma query when no search is provided
      [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            category: true,
            comments: {
              select: {
                rating: true,
              },
            },
          },
          orderBy,
        }),
        this.prisma.product.count({ where }),
      ]);

      const productsWithRating = products.map((product) => {
        const ratings = product.comments.map((comment) => comment.rating);
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
            : 0;

        const { comments, ...productWithoutComments } = product;
        return {
          ...productWithoutComments,
          averageRating: Number(averageRating.toFixed(1)),
          totalRatings: ratings.length,
        };
      });

      products = productsWithRating;
    }

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
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: {
        category: true,
        comments: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const ratings = product.comments.map((comment) => comment.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
        : 0;

    const { comments, ...productWithoutComments } = product;
    return {
      ...productWithoutComments,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    };
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
