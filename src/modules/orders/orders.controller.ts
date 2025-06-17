import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CustomerGuard } from '../auth/guards/customer.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Listar pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
  })
  @Get()
  findAll(@Query() query: FindAllOrdersDto, @Req() req: AuthenticatedRequest) {
    return this.ordersService.findAll(req.user.id, req.user.role, query);
  }

  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.ordersService.findOne(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @UseGuards(CustomerGuard)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Excluir pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido não encontrado',
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @ApiOperation({ summary: 'Dashboard administrativo com estatísticas' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalSales: {
          type: 'number',
          description: 'Total de vendas em reais',
          example: 15499.5,
        },
        totalOrders: {
          type: 'number',
          description: 'Total de pedidos',
          example: 25,
        },
        averageOrderValue: {
          type: 'number',
          description: 'Valor médio por pedido',
          example: 619.98,
        },
        ordersByStatus: {
          type: 'object',
          description: 'Pedidos agrupados por status',
          example: {
            PENDING: 5,
            PROCESSING: 8,
            SHIPPED: 7,
            DELIVERED: 3,
            CANCELLED: 2,
          },
        },
        salesByMonth: {
          type: 'array',
          description: 'Vendas por mês (últimos 12 meses)',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string', format: 'date-time' },
              orders: { type: 'number' },
              revenue: { type: 'number' },
            },
          },
        },
        salesByCategory: {
          type: 'array',
          description: 'Vendas por categoria',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              orders: { type: 'number' },
              totalQuantity: { type: 'number' },
              revenue: { type: 'number' },
            },
          },
        },
        salesByDay: {
          type: 'array',
          description: 'Vendas por dia (últimos 30 dias)',
          items: {
            type: 'object',
            properties: {
              day: { type: 'string', format: 'date' },
              orders: { type: 'number' },
              revenue: { type: 'number' },
            },
          },
        },
        topProducts: {
          type: 'array',
          description: 'Produtos mais vendidos',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              productName: { type: 'string' },
              totalQuantity: { type: 'number' },
              totalRevenue: { type: 'number' },
            },
          },
        },
        recentOrders: {
          type: 'array',
          description: 'Pedidos mais recentes',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              total: { type: 'number' },
              status: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado - Apenas administradores podem acessar este recurso',
  })
  @UseGuards(AdminGuard)
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }
}
