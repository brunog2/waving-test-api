import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Listar comentários de um produto' })
  @ApiQuery({
    name: 'productId',
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentários retornada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID do produto é obrigatório',
  })
  @Get()
  findAll(@Query() query: FindAllCommentsDto) {
    if (!query.productId) {
      throw new Error('Product ID is required');
    }
    return this.commentsService.findAllByProduct(query.productId, query);
  }

  @ApiOperation({ summary: 'Criar novo comentário' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.create(createCommentDto, req.user.id);
  }
}
