import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CartItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
