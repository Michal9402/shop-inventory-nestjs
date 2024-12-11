import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseFloatPipe, UsePipes, ParseIntPipe, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('catalogId') catalogIdString?: string) {
    if (catalogIdString) {
      const catalogId = Number.parseInt(catalogIdString, 10);
      
      if (isNaN(catalogId) || catalogId <= 0) {
        throw new BadRequestException('catalogId is invalid')
      }
      return this.productsService.findInCatalog(catalogId);
    }
    
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
