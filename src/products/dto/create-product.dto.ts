import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  @ApiProperty({
    description: 'Name of the product',
    example: 'BMW',
  })
  name: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  @IsPositive()
  @Min(0.01)
  @Transform(({ value }) => Number.parseFloat(value))
  @ApiProperty({
    description: 'Price of the product',
    example: '3.22',
  })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  @ApiProperty({
    description: 'Stock quantity of the product',
    example: '1',
  })
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @ApiProperty({
    description: 'Id of catalog which owns has this product',
    example: '1',
    required: false,
  })
  catalogId: number;
}
