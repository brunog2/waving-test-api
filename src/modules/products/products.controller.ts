import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FindAllProductsDto } from './dto/find-all-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() filters: FindAllProductsDto) {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Request() req: AuthenticatedRequest, @Body() createDto: any) {
    // Agora você tem acesso ao usuário autenticado via req.user
    console.log('User authenticated:', req.user);
    return this.productsService.create(createDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    // Agora você tem acesso ao usuário autenticado via req.user
    console.log('User authenticated:', req.user);
    return this.productsService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    // Agora você tem acesso ao usuário autenticado via req.user
    console.log('User authenticated:', req.user);
    return this.productsService.remove(id);
  }
}
