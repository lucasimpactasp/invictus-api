import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Between, Like, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';
import { Installment } from '../installment/installment.entity';
import { User } from '../user/user.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InvoiceService extends CrudService<Invoice> {
  constructor(
    @InjectRepository(Invoice) repo: Repository<Invoice>,
    private productService: ProductService,
  ) {
    super(repo);
  }

  public async createOneInvoice(invoice: Invoice): Promise<Invoice> {
    let errors = 0;

    invoice.products.forEach(async product => {
      await this.productService.updateProd(product.id).catch(error => {
        errors += 1;
        throw error;
      });
    });

    if (errors > 0) {
      throw new BadRequestException('Não há este produto em estoque');
    }

    return await this.repo.save(invoice);
  }

  public async search(body: { from: Date; until: Date }) {
    return await this.repo.find({
      created_at: Between(body.from, body.until),
    });
  }

  public async searchInvoices(body: { title: string }): Promise<Invoice[]> {
    return await this.repo.find({
      title: Like(`%${body.title}%`),
    });
  }

  public async getInvoice(id: string): Promise<Invoice> {
    return await this.repo.findOne({
      relations: ['products', 'installments', 'seller', 'buyer'],
      where: {
        id: id,
      },
    });
  }
}
