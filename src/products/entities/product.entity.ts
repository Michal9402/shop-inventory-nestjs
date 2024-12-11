import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductEntity implements Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  rating: number | null;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  catalogId: number | null;
}
