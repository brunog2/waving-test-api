import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, userRole: Role, filters: FindAllOrdersDto) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(userRole !== Role.ADMIN ? { userId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: orders,
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

  async findOne(id: string, userId: string, userRole: Role) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        ...(userRole !== Role.ADMIN ? { userId } : {}),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { cartProductIds } = createOrderDto;

    if (cartProductIds.length === 0) {
      throw new BadRequestException('Selecione pelo menos um item do carrinho');
    }

    // Busca os itens do carrinho selecionados
    const cartItems = await this.prisma.cartProduct.findMany({
      where: {
        id: { in: cartProductIds },
        userId,
      },
      include: {
        product: true,
      },
    });

    // Verifica se todos os itens solicitados foram encontrados
    if (cartItems.length !== cartProductIds.length) {
      throw new BadRequestException(
        'Um ou mais itens do carrinho não foram encontrados',
      );
    }

    // Verifica se todos os produtos ainda estão disponíveis
    const invalidProducts = cartItems.filter((item) => !item.product.available);

    if (invalidProducts.length > 0) {
      throw new BadRequestException(
        'Um ou mais produtos não estão mais disponíveis',
      );
    }

    // Cria os itens do pedido usando os dados do carrinho
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Calcula o total do pedido
    const total = orderItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );

    // Cria o pedido e seus itens em uma transação
    const order = await this.prisma.$transaction(async (prisma) => {
      // Cria o pedido
      const newOrder = await prisma.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      // Remove os itens do carrinho que foram comprados
      await prisma.cartProduct.deleteMany({
        where: {
          id: { in: cartProductIds },
          userId,
        },
      });

      return newOrder;
    });

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return await this.prisma.order.update({
      where: { id },
      data: { status: updateOrderDto.status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return await this.prisma.order.delete({
      where: { id },
    });
  }
}
