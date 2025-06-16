import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Req } from '@nestjs/common';

@Controller('product-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':productId')
  async findAllByProduct(
    @Param('productId') productId: string,
    @Query() filters: FindAllCommentsDto,
  ) {
    return await this.commentsService.findAllByProduct(productId, filters);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log(req.user);
    return this.commentsService.create(createCommentDto, req.user.id);
  }
}
