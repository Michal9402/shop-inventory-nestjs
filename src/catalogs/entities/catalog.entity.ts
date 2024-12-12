import { ApiProperty } from '@nestjs/swagger';
import { Catalog } from '@prisma/client';

export class CatalogEntity implements Catalog {
  @ApiProperty({
    description: 'Unique identifier',
  })
  id: number;

  @ApiProperty({
    description: 'Name of the catalog',
    example: 'Cars',
  })
  name: string;
}
