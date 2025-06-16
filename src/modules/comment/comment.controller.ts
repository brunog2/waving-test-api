import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';

@Controller('products/:productId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Param('productId') productId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(productId, createCommentDto);
  }

  @Get()
  async findAll(@Param('productId') productId: string) {
    return this.commentService.findAll(productId);
  }
}
