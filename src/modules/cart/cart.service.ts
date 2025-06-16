import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';
import { FindAllCartItemsDto } from './dto/find-all-cart-items.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: FindAllCartItemsDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.cartProduct.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              available: true,
            },
          },
        },
      }),
      this.prisma.cartProduct.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items,
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

  async addItem(userId: string, addItemDto: CartItemDto) {
    const { productId, quantity } = addItemDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.available) {
      throw new NotFoundException('Produto não encontrado ou não disponível');
    }

    const existingItem = await this.prisma.cartProduct.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      return await this.prisma.cartProduct.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        select: {
          id: true,
          quantity: true,
          productId: true,
        },
      });
    }

    return await this.prisma.cartProduct.create({
      data: {
        userId,
        productId,
        quantity,
      },
      select: {
        id: true,
        quantity: true,
        productId: true,
      },
    });
  }

  async updateItem(userId: string, id: string, updateItemDto: CartItemDto) {
    const { quantity } = updateItemDto;

    const cartItem = await this.prisma.cartProduct.findFirst({
      where: { id, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    return await this.prisma.cartProduct.update({
      where: { id },
      data: { quantity },
      select: {
        id: true,
        quantity: true,
        productId: true,
      },
    });
  }

  async removeItem(userId: string, id: string) {
    const cartItem = await this.prisma.cartProduct.findFirst({
      where: { id, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    return await this.prisma.cartProduct.delete({
      where: { id },
    });
  }
}
