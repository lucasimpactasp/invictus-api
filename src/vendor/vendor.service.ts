import { Injectable } from '@nestjs/common';
import { Vendor } from './vendor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../lib/crud-services/crud-services';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class VendorService extends CrudService<Vendor> {
  constructor(
    @InjectRepository(Vendor)
      repo: Repository<Vendor>,
  ) {
    super(repo);
  }

  public async createVendor(body: Vendor): Promise<Vendor> {
    return await this.repo.save(body);
  }

  public async updateVendor(id: string, vendor: Vendor): Promise<Category> {
    const newVendor: Vendor = {
      ...vendor,
    };

    delete newVendor.products;

    newVendor.products = vendor.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });


    if (newVendor.products.length === 0) {
      newVendor.products = null;
    }

    await this.repo.save({ ...newVendor, id });
    return newVendor;
  }
}
