import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCatalogDto implements Prisma.CatalogCreateInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}