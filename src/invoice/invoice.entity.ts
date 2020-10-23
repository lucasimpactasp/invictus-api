import { BaseEntity } from 'src/base-entity';
import { Installment } from 'src/installment/installment.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Invoice extends BaseEntity<Invoice> {
  @Column({
    nullable: false,
  })
  total: number

  @Column({
    nullable: true,
    default: 0
  })
  discount: number

  @OneToMany(
    () => Installment,
    installment => installment.invoice,
    )
    installments: Installment[];

  @ManyToMany(
    () => User,
    user => user.madeInvoices
  )
  sellers: User[];

  @ManyToMany(
    () => User,
    user => user.purchasedInvoices
  )
  buyers: User[]

  @ManyToMany(
    () => Product,
    product => product.invoices,
  )
  products: Product[];
}
