import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(productId: string, createCommentDto: CreateCommentDto) {
    // TODO: Implement create comment logic
  }

  async findAll(productId: string) {
    // TODO: Implement find all comments logic
  }
}
