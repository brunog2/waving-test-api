import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('products/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Param('productId') productId: string, @Body() createDto: any) {
    return this.commentsService.create(productId, createDto);
  }

  @Get()
  async findAll(@Param('productId') productId: string) {
    return this.commentsService.findAll(productId);
  }
}
