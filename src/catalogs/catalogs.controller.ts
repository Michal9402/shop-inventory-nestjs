import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) { }

  @Post()
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.catalogsService.create(createCatalogDto);
  }

  @Get()
  findAll() {
    return this.catalogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCatalogDto: UpdateProductDto) {
    return this.catalogsService.update(id, updateCatalogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.remove(id);
  }
}
