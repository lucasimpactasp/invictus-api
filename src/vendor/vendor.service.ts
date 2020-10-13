import { Injectable } from '@nestjs/common';
import { Vendor } from './vendor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../lib/crud-services/crud-services';

@Injectable()
export class VendorService extends CrudService<Vendor> {
  constructor(
    @InjectRepository(Vendor)
    repo: Repository<Vendor>,
  ) {
    super(repo);
  }


}
