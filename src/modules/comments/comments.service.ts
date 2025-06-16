import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAllByProduct(productId: string, filters: FindAllCommentsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        select: {
          id: true,
          rating: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        where: {
          productId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({
        where: {
          productId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: comments,
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

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: createCommentDto.productId },
    });
    console.log(userId);
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Produto não encontrado',
        error: 'Not Found',
      });
    }

    return await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        product: {
          connect: { id: createCommentDto.productId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
