import { Category } from 'src/category/category.entity';
import { Vendor } from 'src/vendor/vendor.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity()
export class Product extends BaseEntity<Product> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  dimension: string;

  /* @ManyToOne(
    () => Category,
    category => category.products,
  )
  category: string;

  @ManyToOne(
    () => Vendor,
    vendor => vendor.products,
  )
  vendor: Vendor; */
}
