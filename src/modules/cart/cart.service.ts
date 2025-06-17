import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartItemDto, CartItemsDto } from './dto/cart-item.dto';
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
        select: {
          id: true,
          quantity: true,
          createdAt: true,
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

    // Calcular o preço total de todos os itens no carrinho
    const allItems = await this.prisma.cartProduct.findMany({
      where: { userId },
      select: {
        quantity: true,
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    const totalPrice = allItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        totalPrice: Number(totalPrice.toFixed(2)),
      },
    };
  }

  async addItem(userId: string, addItemDto: CartItemDto) {
    const { productId, quantity } = addItemDto;

    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero');
    }

    const product = await this.prisma.product.findFirst({
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

    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero');
    }

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

  async addItems(userId: string, addItemsDto: CartItemsDto) {
    const { items } = addItemsDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Pelo menos um item deve ser fornecido');
    }

    // Validar todos os produtos antes de adicionar
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        available: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException(
        'Um ou mais produtos não encontrados ou não disponíveis',
      );
    }

    // Validar quantidades
    for (const item of items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('A quantidade deve ser maior que zero');
      }
    }

    const results: any[] = [];

    // Adicionar cada item
    for (const item of items) {
      const existingItem = await this.prisma.cartProduct.findFirst({
        where: {
          userId,
          productId: item.productId,
        },
      });

      if (existingItem) {
        const updatedItem = await this.prisma.cartProduct.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
          select: {
            id: true,
            quantity: true,
            productId: true,
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
        });
        results.push(updatedItem);
      } else {
        const newItem = await this.prisma.cartProduct.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
          },
          select: {
            id: true,
            quantity: true,
            productId: true,
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
        });
        results.push(newItem);
      }
    }

    return {
      message: `${results.length} itens adicionados com sucesso`,
      data: results,
    };
  }

  async getTotalItems(userId: string) {
    const result = await this.prisma.cartProduct.aggregate({
      where: { userId },
      _sum: {
        quantity: true,
      },
    });

    return {
      totalItems: result._sum.quantity || 0,
    };
  }

  async clearCart(userId: string) {
    const deletedItems = await this.prisma.cartProduct.deleteMany({
      where: { userId },
    });

    return {
      message: 'Carrinho limpo com sucesso',
      deletedCount: deletedItems.count,
    };
  }
}
