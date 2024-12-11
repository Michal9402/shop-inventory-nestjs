import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Injectable()
export class CatalogsService {
  constructor(private readonly dbService: DatabaseService) { }

  async create(createCatalogDto: CreateCatalogDto) {
    return this.dbService.catalog.create({
      data: createCatalogDto
    });
  }

  async findAll() {
    return this.dbService.catalog.findMany();
  }

  async findOne(id: number) {
    return this.dbService.catalog.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, updateCatalogDto: UpdateCatalogDto) {
    return this.dbService.catalog.update({
      where: {
        id
      },
      data: updateCatalogDto
    })
  }

  async remove(id: number) {
    return this.dbService.catalog.delete({
      where: {
        id
      }
    });
  }
}
