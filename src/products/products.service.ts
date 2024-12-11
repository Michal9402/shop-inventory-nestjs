import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) { }

  async create(createProductDto: CreateProductDto) {
    return await this.dbService.product.create({
      data: createProductDto
    });
  }

  async findAll() {
    return await this.dbService.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.dbService.product.findUnique({
      where: {
        id
      }
    })

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} doesn't exists`)
    }
    return product;
  }

  async findInCatalog(catalogId: number) {
    const products = await this.dbService.product.findMany({
      where: {
        catalogId
      }
    })

    return products
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!updateProductDto) {
      throw new BadRequestException()
    }

    await this.findOne(id);

    try {
      const newCatalog = await this.dbService.product.update({
        where: { id },
        data: updateProductDto
      })
      return newCatalog;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err?.code === 'P2003') {
        throw new NotFoundException(`Catalog with id: ${updateProductDto?.catalogId} doesn't exists`)
      }
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.dbService.product.delete({
      where: {
        id
      }
    });
  }
}
