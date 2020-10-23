import "dotenv/config"

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InstallmentModule } from './installment/installment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    VendorModule,
    OAuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    InvoiceModule,
    InstallmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
