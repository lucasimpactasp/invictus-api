import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Between, Like, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';
import { Installment } from '../installment/installment.entity';
import { User } from '../user/user.entity';

@Injectable()
export class InvoiceService extends CrudService<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) {
    super(repo);
  }

  public async createOneInvoice(invoice: Invoice): Promise<Invoice> {
    return await this.repo.save(invoice);
  }

  public async updateInvoice(id: string, invoice: Invoice): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
    };

    delete newInvoice.products;

    newInvoice.total = invoice.installments.reduce(
      (acc, value) => acc + value.price,
      0,
    );

    newInvoice.products = invoice.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });

    newInvoice.installments.map((installment) => {
      delete installment.invoice;
    });

    if (newInvoice.products.length === 0) {
      newInvoice.products = null;
    }

    if (newInvoice.installments.length === 0) {
      newInvoice.products = null;
    }

    console.log(newInvoice);

    // await this.repo.save({ ...newInvoice, id });
    return newInvoice;
  }

  public async search(body: { from: Date, until: Date }) {
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
