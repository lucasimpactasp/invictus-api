import { BaseEntity } from 'src/base-entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentMethod {
  BOLETO = 'BOLETO',
  CARTAO_DE_CREDITO = 'CARTAO_DE_CREDITO',
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
  })
  paymentDate: Date;

  @ManyToOne(
    () => Invoice,
    invoice => invoice.installments,
  )
  invoice: Invoice;
}
