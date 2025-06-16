import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    required: true,
    example: 'Eletrônicos',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
