import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Repository } from 'typeorm';
import {
  Installment,
  PaymentMethod,
  PaymentStatus,
} from './installment.entity';

@Injectable()
export class InstallmentService extends CrudService<Installment> {
  constructor(@InjectRepository(Installment) repo: Repository<Installment>) {
    super(repo);
  }

  public async payInstallment(
    id: string,
    installment: Installment,
  ): Promise<Installment> {
    const installmentGet: Installment = await this.repo.findOne(id);

    if (installmentGet.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Invoice já paga');
    }

    await this.repo.update(id, {
      ...installment,
      paymentDate: new Date().toISOString(),
      paymentStatus: PaymentStatus.PAID,
    });
    return installment;
  }

  @Cron('0 */5 * * * *')
  async updateInstallment() {
    const installments: Installment[] = await this.repo.find({
      where: {
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    installments.map(installment => {
      if (installment.paymentDate < new Date()) {
        this.repo.update(installment.id, {
          ...installment,
          paymentStatus: PaymentStatus.EXPIRED,
        });
      }
    });
  }
}
