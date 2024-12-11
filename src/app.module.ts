import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CatalogsModule } from './catalogs/catalogs.module';

@Module({
  imports: [ProductsModule, CatalogsModule],
})
export class AppModule { }
