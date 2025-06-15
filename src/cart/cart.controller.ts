import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findAll() {
    return this.cartService.findAll();
  }

  @Post('items')
  async addItem(@Body() addItemDto: any) {
    return this.cartService.addItem(addItemDto);
  }

  @Patch('items/:id')
  async updateItem(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.cartService.updateItem(id, updateItemDto);
  }

  @Delete('items/:id')
  async removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }
}
