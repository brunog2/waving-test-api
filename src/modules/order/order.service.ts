import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // TODO: Implement create order logic
  }

  async findAll() {
    // TODO: Implement find all orders logic
  }

  async findOne(id: string) {
    // TODO: Implement find one order logic
  }
}
