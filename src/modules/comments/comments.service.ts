import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(productId: string, createDto: any) {
    // TODO: Implement create comment logic
  }

  async findAll(productId: string) {
    // TODO: Implement find all comments logic
  }
}
