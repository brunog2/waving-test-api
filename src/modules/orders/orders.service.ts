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

  async getDashboardStats() {
    // Estatísticas gerais
    const [totalSales, totalOrders] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      }),
    ]);

    // Pedidos por status
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Vendas por mês (últimos 12 meses)
    const salesByMonth = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', o."created_at") as month,
        COUNT(o.id) as orders,
        SUM(o.total) as revenue
      FROM "orders" o
      WHERE o.status != 'CANCELLED'
        AND o."created_at" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', o."created_at")
      ORDER BY month ASC
    `;

    // Vendas por categoria
    const salesByCategory = await this.prisma.$queryRaw`
      SELECT 
        c.name as category,
        COUNT(DISTINCT o.id) as orders,
        SUM(op.quantity) as totalQuantity,
        SUM(op.quantity * op.price) as revenue
      FROM "order_products" op
      JOIN "products" p ON op."product_id" = p.id
      JOIN "categories" c ON p."category_id" = c.id
      JOIN "orders" o ON op."order_id" = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `;

    // Vendas por dia (últimos 30 dias)
    const salesByDay = await this.prisma.$queryRaw`
      SELECT 
        DATE(o."created_at") as day,
        COUNT(o.id) as orders,
        SUM(o.total) as revenue
      FROM "orders" o
      WHERE o.status != 'CANCELLED'
        AND o."created_at" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(o."created_at")
      ORDER BY day ASC
    `;

    // Produtos mais vendidos
    const topProducts = await this.prisma.$queryRaw`
      SELECT 
        op."product_id" as "productId",
        p.name as "productName",
        SUM(op.quantity) as "totalQuantity",
        SUM(op.quantity * op.price) as "totalRevenue"
      FROM "order_products" op
      JOIN "products" p ON op."product_id" = p.id
      JOIN "orders" o ON op."order_id" = o.id
      WHERE o.status != 'CANCELLED'
      GROUP BY op."product_id", p.name
      ORDER BY "totalQuantity" DESC
      LIMIT 10
    `;

    // Pedidos mais recentes
    const recentOrders = await this.prisma.order.findMany({
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Calcular valor médio por pedido
    const averageOrderValue =
      totalOrders > 0 ? Number(totalSales._sum.total || 0) / totalOrders : 0;

    // Formatar ordersByStatus
    const formattedOrdersByStatus = ordersByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalSales: Number(totalSales._sum.total || 0),
      totalOrders,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      ordersByStatus: formattedOrdersByStatus,
      // Dados para gráficos
      salesByMonth: (salesByMonth as any[]).map((item: any) => ({
        month: item.month,
        orders: Number(item.orders),
        revenue: Number(item.revenue || 0),
      })),
      salesByCategory: (salesByCategory as any[]).map((item: any) => ({
        category: item.category,
        orders: Number(item.orders),
        totalQuantity: Number(item.totalquantity),
        revenue: Number(item.revenue || 0),
      })),
      salesByDay: (salesByDay as any[]).map((item: any) => ({
        day: item.day,
        orders: Number(item.orders),
        revenue: Number(item.revenue || 0),
      })),
      topProducts: (topProducts as any[]).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        totalQuantity: Number(item.totalQuantity),
        totalRevenue: Number(item.totalRevenue || 0),
      })),
      recentOrders: recentOrders.map((order) => ({
        ...order,
        total: Number(order.total),
      })),
    };
  }
}
