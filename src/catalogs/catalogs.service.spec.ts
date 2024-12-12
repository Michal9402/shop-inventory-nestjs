import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundException } from '@nestjs/common';
import { cloneDeep } from 'lodash';

describe('CatalogsService', () => {
  let service: CatalogsService;

  type MockCatalogType = {
    id: number;
    name: string;
    products?: any[];
  };

  const initialMockCatalogs: MockCatalogType[] = [
    { id: 1, name: 'Test catalog 1' },
    { id: 2, name: 'Test catalog 2' },
  ];

  let mockCatalogs: MockCatalogType[] = [];

  const mockDatabase = {
    catalog: {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: Date.now(),
          ...dto.data,
        }),
      ),
      findMany: jest
        .fn()
        .mockResolvedValue(Promise.resolve(initialMockCatalogs)),
      findUnique: jest.fn().mockImplementation((args) => {
        const catalogs = cloneDeep(initialMockCatalogs);
        const catalog = catalogs.find(
          (catalog) => catalog.id === args.where.id,
        );
        if (args.include && args.include.products) {
          catalog.products = [];
        }
        return catalog;
      }),
      update: jest.fn().mockImplementation((args) => {
        const catalog = initialMockCatalogs.find(
          (cat) => cat.id === args.where.id,
        );

        return {
          ...catalog,
          name: args.data.name,
        };
      }),
      delete: jest.fn().mockImplementation((args) => {
        const catalog = initialMockCatalogs.find(
          (cat) => cat.id === args.where.id,
        );

        return catalog;
      }),
    },
  };

  beforeEach(async () => {
    mockCatalogs = [...initialMockCatalogs];
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogsService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabase)
      .compile();

    service = module.get<CatalogsService>(CatalogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new catalog', async () => {
    const result = await service.create({ name: 'Test catalog' });
    expect(result).toEqual({
      id: expect.any(Number),
      name: 'Test catalog',
    });
  });

  it('should return list of catalogs', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockCatalogs);
  });

  it('should return catalog by id', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, name: 'Test catalog 1' });
  });

  it('should throw NotFoundException when catalog not found by id', async () => {
    await expect(service.findOne(999)).rejects.toThrow(
      new NotFoundException("Catalog with id: 999 doesn't exists"),
    );
  });

  it('should return catalog with products if shouldIncludeProducts is true', async () => {
    const result = await service.findOne(1, true);
    expect(result).toEqual({
      id: 1,
      name: 'Test catalog 1',
      products: [],
    });
  });

  it('should update catalog by id', async () => {
    expect(await service.update(1, { name: 'Updated name' })).toEqual({
      id: expect.any(Number),
      name: 'Updated name',
    });
  });

  it('should throw NotFoundException when updating non-existing catalog', async () => {
    const updateDto = { name: 'Non-existent catalog' };

    await expect(service.update(999, updateDto)).rejects.toThrow(
      new NotFoundException("Catalog with id: 999 doesn't exists"),
    );
  });

  it('should delete catalog by id', async () => {
    const result = await service.remove(1);

    expect(result).toEqual({ id: 1, name: 'Test catalog 1' });
  });

  it('should throw NotFoundException when deleting non-existing catalog', async () => {
    await expect(service.remove(999)).rejects.toThrow(
      new NotFoundException("Catalog with id: 999 doesn't exists"),
    );
  });
});
