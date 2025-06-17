import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'A quantidade deve ser maior que zero' })
  @IsNotEmpty()
  quantity: number;
}

export class CartItemsDto {
  @ApiProperty({
    description: 'Array de itens do carrinho',
    type: [CartItemDto],
    example: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
      },
      {
        productId: '456e7890-e89b-12d3-a456-426614174000',
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
