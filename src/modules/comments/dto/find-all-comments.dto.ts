import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllCommentsDto {
  @ApiProperty({
    description: 'ID do produto para filtrar comentários',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'Número da página',
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    default: 10,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
