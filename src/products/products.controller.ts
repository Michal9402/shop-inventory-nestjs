import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductCatalogIdDto } from './dto/update-product-catalogid-dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiCreatedResponse({ type: ProductEntity })
  @ApiNotFoundResponse({
    description: "Catalog with id: ${catalogId} doesn't exists",
    example: {
      message: "Catalog with id: 1 doesn't exists",
      error: 'Not Found',
      statusCode: 404,
    },
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of products' })
  @ApiOkResponse({
    type: ProductEntity,
    isArray: true,
    description: 'Products list fetched',
  })
  @ApiQuery({
    name: 'catalogId',
    required: false,
    description: 'ID of the catalog to filter products',
    type: Number,
  })
  @ApiBadRequestResponse({
    description: 'catalogId is invalid',
    example: {
      message: 'catalogId is invalid',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  findAll(@Query('catalogId') catalogIdString?: string) {
    if (catalogIdString) {
      const catalogId = Number.parseInt(catalogIdString, 10);

      if (isNaN(catalogId) || catalogId <= 0) {
        throw new BadRequestException('catalogId is invalid');
      }
      return this.productsService.findInCatalog(catalogId);
    }

    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({
    description: "Product with id: ${id} doesn't exists",
    example: {
      message: "Product with id: ${id} doesn't exists",
      error: 'Not Found',
      statusCode: 404,
    },
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({
    description: "Product with id: ${id} doesn't exists",
    example: {
      message: "Product with id: ${id} doesn't exists",
      error: 'Not Found',
      statusCode: 404,
    },
  })
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/catalog')
  @ApiOperation({
    summary: 'Assign or remove a product from a catalog',
    description:
      'To add product to catalog provide a valid catalogId. \
      If you want to remove product from catalog, as a catalogId provide <b>null</b>.',
  })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({
    description: "Product with id: ${id} doesn't exists",
    example: {
      message: "Product with id: ${id} doesn't exists",
      error: 'Not Found',
      statusCode: 404,
    },
  })
  updateProductCatalog(
    @Param('id') id: string,
    @Body() updateProductCatalogIdDto: UpdateProductCatalogIdDto,
  ) {
    return this.productsService.updateProductCatalogId(
      id,
      updateProductCatalogIdDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiNotFoundResponse({
    description: "Product with id: ${id} doesn't exists",
    example: {
      message: "Product with id: ${id} doesn't exists",
      error: 'Not Found',
      statusCode: 404,
    },
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
