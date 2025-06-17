import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';
import { FindAllCategoriesWithProductsDto } from './dto/find-all-categories-with-products.dto';
import { CategorySimpleDto } from './dto/category-select.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
  })
  @Get()
  async findAll(@Query() filters: FindAllCategoriesDto) {
    return this.categoriesService.findAll(filters);
  }

  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: [CategorySimpleDto],
  })
  @Get('all')
  findAllSimple() {
    return this.categoriesService.findAllSimple();
  }

  @ApiOperation({ summary: 'Listar categorias com seus produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias com seus produtos retornada com sucesso',
  })
  @Get('with-products')
  async findAllWithProducts(
    @Query() filters: FindAllCategoriesWithProductsDto,
  ) {
    return this.categoriesService.findAllWithProducts(filters);
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar nova categoria (apenas admin)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado - Apenas administradores podem acessar este recurso',
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Atualizar categoria (apenas admin)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado - Apenas administradores podem acessar este recurso',
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Remover categoria (apenas admin)' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado - Apenas administradores podem acessar este recurso',
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
