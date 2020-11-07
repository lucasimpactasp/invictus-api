import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Between, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService extends CrudService<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) {
    super(repo);
  }

  public async createOneInvoice(invoice: Invoice): Promise<Invoice> {
    return await this.repo.save(invoice);
  }

  public async search(body: { from: Date, until: Date }) {
    return await this.repo.find({
      created_at: Between(body.from, body.until),
    });
  }
}
