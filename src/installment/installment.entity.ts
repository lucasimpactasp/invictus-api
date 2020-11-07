import { BaseEntity } from 'src/base-entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentMethod {
  BOLETO = 'BOLETO',
  CARTAO_DE_CREDITO = 'CARTAO_DE_CREDITO',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  ERROR = 'ERROR',
}

@Entity()
export class Installment extends BaseEntity<Installment> {
  @Column({
    nullable: true,
    enum: [PaymentMethod.BOLETO, PaymentMethod.CARTAO_DE_CREDITO],
  })
  paymentMethod: PaymentMethod;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
    type: "date"
  })
  paymentDate: Date;

  @Column({
    nullable: true,
    type: "date"
  })
  expirationDate: Date;

  @Column({
    nullable: true,
    enum: [
      PaymentStatus.PENDING,
      PaymentStatus.PAID,
      PaymentStatus.EXPIRED,
      PaymentStatus.ERROR,
    ],
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @ManyToOne(
    () => Invoice,
    invoice => invoice.installments,
  )
  invoice: Invoice;
}
