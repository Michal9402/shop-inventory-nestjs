import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ProductsModule, CatalogsModule, DatabaseModule],
})
export class AppModule {}
