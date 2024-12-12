import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, ValidateIf } from 'class-validator';

export class UpdateProductCatalogIdDto {
  @ValidateIf((obj) => obj.catalogId !== null)
  @IsNumber()
  @Transform(({value}) => value === 'null' ? null : typeof value === 'string' ? Number.parseInt(value, 10) : value)
  @ApiProperty({
    description: 'Id of the catalog. Pass a number to update catalog or null to delete relation',
    example: 4
  })
  catalogId: number | null;
}
