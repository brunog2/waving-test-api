import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Conteúdo do comentário',
    example: 'Produto muito bom, recomendo!',
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'O comentário deve ter pelo menos 3 caracteres' })
  @MaxLength(500, {
    message: 'O comentário não pode ter mais de 500 caracteres',
  })
  content?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'A avaliação deve ser no mínimo 1' })
  @Max(5, { message: 'A avaliação deve ser no máximo 5' })
  @IsNotEmpty()
  rating: number;
}
