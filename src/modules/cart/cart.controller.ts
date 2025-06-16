import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { FindAllCartItemsDto } from './dto/find-all-cart-items.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerGuard } from '../auth/guards/customer.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard, CustomerGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Listar itens do carrinho' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - Apenas clientes podem acessar este recurso',
  })
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindAllCartItemsDto,
  ) {
    return this.cartService.findAll(req.user.id, query);
  }

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - Apenas clientes podem acessar este recurso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado ou não disponível',
  })
  @Post('items')
  addItem(@Req() req: AuthenticatedRequest, @Body() addItemDto: CartItemDto) {
    return this.cartService.addItem(req.user.id, addItemDto);
  }

  @ApiOperation({ summary: 'Atualizar quantidade do item' })
  @ApiParam({
    name: 'id',
    description: 'ID do item no carrinho',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - Apenas clientes podem acessar este recurso',
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado no carrinho' })
  @Patch('items/:id')
  updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateItemDto: CartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, updateItemDto);
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiParam({
    name: 'id',
    description: 'ID do item no carrinho',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - Apenas clientes podem acessar este recurso',
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado no carrinho' })
  @Delete('items/:id')
  removeItem(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }
}
