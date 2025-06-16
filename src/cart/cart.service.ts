import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement find all cart items logic
  }

  async addItem(addItemDto: CartItemDto) {
    // TODO: Implement add item to cart logic
  }

  async updateItem(id: string, updateItemDto: CartItemDto) {
    // TODO: Implement update cart item logic
  }

  async removeItem(id: string) {
    // TODO: Implement remove cart item logic
  }
}
