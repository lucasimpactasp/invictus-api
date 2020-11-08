import { BaseEntity } from 'src/base-entity';
import { Installment } from 'src/installment/installment.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Invoice extends BaseEntity<Invoice> {
  @Column({
    nullable: false,
  })
  total: number;

  @Column({
    nullable: true,
    default: 0,
  })
  discount: number;

  @Column({
    nullable: false,
  })
  title: string;

  @OneToMany(
    () => Installment,
    installment => installment.invoice,
    {
      cascade: true,
    },
  )
  installments: Installment[];

  @ManyToOne(
    () => User,
    user => user.madeInvoices,
    {
      cascade: true,
    },
  )
  seller: User;

  @ManyToOne(
    () => User,
    user => user.purchasedInvoices,
    {
      cascade: true,
    },
  )
  buyer: User;

  @JoinTable()
  @ManyToMany(
    () => Product,
    product => product.invoices,
    {
      cascade: true,
    },
  )
  products: Product[];
}
