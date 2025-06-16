import { ApiProperty } from '@nestjs/swagger';

export class CategorySimpleDto {
  @ApiProperty({
    description: 'ID da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Eletrônicos',
  })
  name: string;
}
