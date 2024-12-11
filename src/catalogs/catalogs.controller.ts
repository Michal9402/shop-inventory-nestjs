import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe, Query, ParseBoolPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CatalogEntity } from './entities/catalog.entity';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) { }

  @Post()
  @ApiOperation({ summary: 'Create new catalog' })
  @ApiCreatedResponse({ type: CatalogEntity })
  create(@Body(ValidationPipe) createCatalogDto: CreateCatalogDto) {
    return this.catalogsService.create(createCatalogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all catalogs' })
  @ApiOkResponse({ type: CatalogEntity, isArray: true, description: 'Catalogs fetched' })
  findAll(@Query('products') shouldIncludeProducts?: string) {
    return this.catalogsService.findAll(shouldIncludeProducts === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get catalog by id' })
  @ApiOkResponse({ type: CatalogEntity })
  @ApiNotFoundResponse({ description: 'Invalid id provided' })
  findOne(@Param('id', ParseIntPipe) id: number, @Query('products') shouldIncludeProducts?: string) {
    return this.catalogsService.findOne(id, shouldIncludeProducts === 'true');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update catalog name' })
  @ApiOkResponse({ type: CatalogEntity })
  @ApiNotFoundResponse({ description: 'Invalid id provided' })
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateCatalogDto: UpdateCatalogDto) {
    return this.catalogsService.update(id, updateCatalogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete catalog by id' })
  @ApiOkResponse({ type: CatalogEntity })
  @ApiNotFoundResponse({ description: 'Invalid id provided' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.remove(id);
  }
}
