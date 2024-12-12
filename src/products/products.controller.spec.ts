import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsControlles', () => {
  let controller: ProductsController;

  const mockProductService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
        id: 'XYZ',
      };
    }),
    findAll: jest.fn(() => [
      { id: 'aaa', name: 'Test product 1' },
      { id: 'bbb', name: 'Test product 2' },
    ]),
    findOne: jest.fn((id: string) => {
      if (id === 'aaa') {
        return { id: 'aaa', name: 'Test product 1' };
      } else {
        throw new NotFoundException(`Product with id: ${id} doesn't exist`);
      }
    }),
    update: jest.fn((id: string, dto) => {
      if (id === 'aaa') {
        return { id: 'aaa', ...dto };
      } else {
        throw new NotFoundException(`Product with id: ${id} doesn't exist`);
      }
    }),
    updateProductCatalogId: jest.fn((id: string, dto) => {
      if (id === 'aaa') {
        return { id: 'aaa', ...dto };
      } else {
        throw new NotFoundException(`Product with id: ${id} doesn't exist`);
      }
    }),
    remove: jest.fn((id: string) => {
      if (id === 'aaa') {
        return { id: 'aaa', name: 'Test product 1' };
      } else {
        throw new NotFoundException(`Product with id: ${id} doesn't exist`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', () => {
    const newProduct = {
      name: 'Test product',
      stockQuantity: 3,
      price: 32.11,
    };
    expect(
      controller.create({
        name: 'Test product',
        stockQuantity: 3,
        price: 32.11,
      }),
    ).toEqual({
      ...newProduct,
      id: expect.any(String),
    });
  });

  it('should return all products', () => {
    expect(controller.findAll()).toEqual([
      { id: 'aaa', name: 'Test product 1' },
      { id: 'bbb', name: 'Test product 2' },
    ]);
  });

  it('should return a single product by id', () => {
    expect(controller.findOne('aaa')).toEqual({
      id: 'aaa',
      name: 'Test product 1',
    });
  });

  it('should throw NotFoundException when trying to find a product that does not exist', () => {
    try {
      controller.findOne('999');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Product with id: 999 doesn't exist");
    }
  });

  it('should update a product', () => {
    const updatedCatalog = { name: 'Updated product' };
    expect(controller.updateProduct('aaa', updatedCatalog)).toEqual({
      id: 'aaa',
      name: 'Updated product',
    });
  });

  it('should throw NotFoundException when trying to update a product that does not exist', () => {
    try {
      controller.updateProduct('999', { name: 'Non-existing product' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Product with id: 999 doesn't exist");
    }
  });

  it('should update products catalog id', () => {
    expect(controller.updateProductCatalog('aaa', { catalogId: 1 })).toEqual({
      id: 'aaa',
      catalogId: 1,
    });
  });

  it('should delete a product', () => {
    expect(controller.remove('aaa')).toEqual({
      id: 'aaa',
      name: 'Test product 1',
    });
  });

  it('should throw NotFoundException when trying to delete a product that does not exist', () => {
    try {
      controller.remove('999');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe("Product with id: 999 doesn't exist");
    }
  });
});
