import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Injectable()
export class CatalogsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createCatalogDto: CreateCatalogDto) {
    const result = await this.dbService.catalog.create({
      data: {
        name: createCatalogDto.name,
      },
    });
    return result;
  }

  async findAll(shouldIncludeProducts?: boolean) {
    return await this.dbService.catalog.findMany({
      include: {
        products: !!shouldIncludeProducts,
      },
    });
  }

  async findOne(id: number, shouldIncludeProducts?: boolean) {
    const catalog = await this.dbService.catalog.findUnique({
      where: {
        id,
      },
      include: {
        products: !!shouldIncludeProducts,
      },
    });

    if (!catalog) {
      throw new NotFoundException(`Catalog with id: ${id} doesn't exists`);
    }
    return catalog;
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    if (!updateCatalogDto.name) {
      throw new BadRequestException('Bad request, please check name property');
    }

    await this.findOne(id);

    const newCatalog = await this.dbService.catalog.update({
      where: { id },
      data: {
        name: updateCatalogDto.name,
      },
    });

    return newCatalog;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.dbService.catalog.delete({
      where: {
        id,
      },
    });
  }
}
