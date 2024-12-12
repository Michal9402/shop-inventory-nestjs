import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';

describe('', () => {
  let service: ProductsService;

  type MockProductType = {
    id: string;
    name: string;
    products?: any[];
  };

  const initialMockProducts: ProductEntity[] = [
    {
      id: 'aaa',
      name: 'Test product 1',
      price: 34.44,
      stockQuantity: 1,
      catalogId: 1,
    },
    {
      id: 'bbb',
      name: 'Test product 2',
      price: 31.11,
      stockQuantity: 30,
    },
  ];

  let mockProducts: MockProductType[] = [];

  const mockDatabase = {
    product: {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: Date.now(),
          ...dto.data,
        }),
      ),
      findMany: jest.fn().mockImplementation((args) => {
        if (args?.where?.catalogId) {
          return initialMockProducts.filter(
            (p) => p.catalogId === args?.where?.catalogId,
          );
        }
        return initialMockProducts;
      }),
      findUnique: jest.fn().mockImplementation((args) => {
        const product = initialMockProducts.find(
          (product) => product.id === args.where.id,
        );
        return product;
      }),
      update: jest.fn().mockImplementation((args) => {
        const product = initialMockProducts.find(
          (cat) => cat.id === args.where.id,
        );

        return {
          ...product,
          name: args.data.name,
        };
      }),
      delete: jest.fn().mockImplementation((args) => {
        const product = initialMockProducts.find(
          (cat) => cat.id === args.where.id,
        );

        return product;
      }),
    },
  };

  beforeEach(async () => {
    mockProducts = [...initialMockProducts];
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabase)
      .compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new product', async () => {
    const result = await service.create({
      name: 'Test product',
      price: 11.11,
      stockQuantity: 312,
    });
    expect(result).toEqual({
      id: expect.any(Number),
      name: 'Test product',
      price: 11.11,
      stockQuantity: 312,
    });
  });

  it('should return list of products', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockProducts);
  });

  it('should return product by id', async () => {
    const result = await service.findOne('aaa');
    expect(result).toEqual({
      id: 'aaa',
      name: 'Test product 1',
      price: 34.44,
      stockQuantity: 1,
      catalogId: 1,
    });
  });

  it('should throw NotFoundException when product not found by id', async () => {
    await expect(service.findOne('999')).rejects.toThrow(
      new NotFoundException("Product with id: 999 doesn't exists"),
    );
  });

  it('should return products in provided catalogId ', async () => {
    const result = await service.findInCatalog(1);
    expect(result).toEqual([
      {
        id: 'aaa',
        name: 'Test product 1',
        price: 34.44,
        stockQuantity: 1,
        catalogId: 1,
      },
    ]);
  });

  it('should update product by id', async () => {
    expect(await service.update('aaa', { name: 'Updated name' })).toEqual({
      id: 'aaa',
      name: 'Updated name',
      price: 34.44,
      stockQuantity: 1,
      catalogId: 1,
    });
  });

  it('should throw NotFoundException when updating non-existing product', async () => {
    const updateDto = { name: 'Non-existent product' };

    await expect(service.update('999', updateDto)).rejects.toThrow(
      new NotFoundException("Product with id: 999 doesn't exists"),
    );
  });

  it('should delete product by id', async () => {
    const result = await service.remove('aaa');

    expect(result).toEqual({
      id: 'aaa',
      name: 'Test product 1',
      price: 34.44,
      stockQuantity: 1,
      catalogId: 1,
    });
  });

  it('should throw NotFoundException when deleting non-existing product', async () => {
    await expect(service.remove('999')).rejects.toThrow(
      new NotFoundException("Product with id: 999 doesn't exists"),
    );
  });
});
