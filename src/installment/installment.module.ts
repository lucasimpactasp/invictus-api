import { Module } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { InstallmentController } from './installment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment } from './installment.entity';

@Module({
  providers: [InstallmentService],
  controllers: [InstallmentController],
  imports: [TypeOrmModule.forFeature([Installment])],
  exports: [InstallmentService]
})
export class InstallmentModule {}
