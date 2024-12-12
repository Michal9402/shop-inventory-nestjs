import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { NotFoundException } from '@nestjs/common';

describe('CatalogsController', () => {
  let controller: CatalogsController;

  const mockCatalogService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
        id: Date.now(),
      };
    }),
    findAll: jest.fn(() => [
      { id: 1, name: 'Test catalog 1' },
      { id: 2, name: 'Test catalog 2' },
    ]),
    findOne: jest.fn((id: number) => {
      if (id === 1) {
        return { id: 1, name: 'Test catalog 1' };
      } else {
        throw new NotFoundException(`Catalog with id: ${id} doesn't exist`);
      }
    }),
    update: jest.fn((id: number, dto) => {
      if (id === 1) {
        return { id: 1, ...dto };
      } else {
        throw new NotFoundException(`Catalog with id: ${id} doesn't exist`);
      }
    }),
    remove: jest.fn((id: number) => {
      if (id === 1) {
        return { id: 1, name: 'Test catalog 1' };
      } else {
        throw new NotFoundException(`Catalog with id: ${id} doesn't exist`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogsController],
      providers: [CatalogsService],
    })
      .overrideProvider(CatalogsService)
      .useValue(mockCatalogService)
      .compile();

    controller = module.get<CatalogsController>(CatalogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a catalog', () => {
    expect(controller.create({ name: 'Test catalog' })).toEqual({
      id: expect.any(Number),
      name: 'Test catalog',
    });
  });

  it('should return all catalogs', () => {
    expect(controller.findAll()).toEqual([
      { id: 1, name: 'Test catalog 1' },
      { id: 2, name: 'Test catalog 2' },
    ]);
  });

  it('should return a single catalog by id', () => {
    expect(controller.findOne(1)).toEqual({ id: 1, name: 'Test catalog 1' });
  });

  it('should throw NotFoundException when trying to find a catalog that does not exist', () => {
    try {
      controller.findOne(999);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Catalog with id: 999 doesn't exist");
    }
  });

  it('should update a catalog', () => {
    const updatedCatalog = { name: 'Updated catalog' };
    expect(controller.update(1, updatedCatalog)).toEqual({
      id: 1,
      name: 'Updated catalog',
    });
  });

  it('should throw NotFoundException when trying to update a catalog that does not exist', () => {
    try {
      controller.update(999, { name: 'Non-existing catalog' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Catalog with id: 999 doesn't exist");
    }
  });

  it('should delete a catalog', () => {
    expect(controller.remove(1)).toEqual({ id: 1, name: 'Test catalog 1' });
  });

  it('should throw NotFoundException when trying to delete a catalog that does not exist', () => {
    try {
      controller.remove(999);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Catalog with id: 999 doesn't exist");
    }
  });
});
