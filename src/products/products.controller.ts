import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of products' })
  @ApiOkResponse({ 
    type: ProductEntity,
    isArray: true,
    description: 'Products list fetched'
  })
  @ApiQuery({
    name: 'catalogId',
    required: false,
    description: 'ID of the catalog to filter products',
    type: Number,
  })
  @ApiBadRequestResponse({
    description: 'catalogId is invalid'
  })
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
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({ description: "Product with id: ${id} doesn't exists" })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({ description: "Product with id: ${id} doesn't exists" })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({ description: "Product with id: ${id} doesn't exists" })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
