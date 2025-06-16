import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    required: true,
    example: 'Eletrônicos Atualizados',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
