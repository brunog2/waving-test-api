import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // TODO: Implement find all products logic
  }

  async findOne(id: string) {
    // TODO: Implement find one product logic
  }

  async create(createProductDto: CreateProductDto) {
    // TODO: Implement create product logic
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // TODO: Implement update product logic
  }

  async remove(id: string) {
    // TODO: Implement remove product logic
  }
}
