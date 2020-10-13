import { Product } from 'src/product/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
// import { Product } from '../product/product.entity';
@Entity()
export class Category extends BaseEntity<Category> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  slug: string;

  /* @OneToMany(
    () => Product,
    product => product.category,
  )
  products: Product[]; */
}
