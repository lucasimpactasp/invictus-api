import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Repository } from 'typeorm';
import { Installment } from './installment.entity';

@Injectable()
export class InstallmentService extends CrudService<Installment> {
  constructor(@InjectRepository(Installment) repo: Repository<Installment>) {
    super(repo);
  }
}
