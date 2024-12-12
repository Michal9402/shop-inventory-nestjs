import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

type ProductEntityType = Omit<Product, 'catalogId'> & {
  categoryId?: number | null;
};

export class ProductEntity implements ProductEntityType {
  @ApiProperty({
    description: 'Unique identifier',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Mobile phone XYZ',
  })
  name: string;

  @ApiProperty({
    description: 'Price of the product',
    example: '299.99',
  })
  price: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 221,
  })
  stockQuantity: number;

  @ApiProperty({
    description: 'Id of catalog where product should be placed',
    example: 12,
    required: false,
    nullable: true,
  })
  catalogId?: number | null;
}
