import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  RelationCount,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BCryptTransformer } from '../lib/bcrypt';
import { Exclude } from 'class-transformer';
import { Product } from 'src/product/product.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { InvoiceService } from 'src/invoice/invoice.service';

export type Gender = 'M' | 'F';
export enum Role {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  DEFAULT = 'default',
}

@Entity()
export class User extends BaseEntity<User> {
  static joinAs(name: string = 'user') {
    const obj = {};
    obj[name] = { allow: ['id', 'firstName', 'lastName', 'email', 'username'] };
    obj[name + '.avatar'] = { allow: ['id', 'storageUrl'] };
    return obj;
  }

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    enum: ['M', 'F'],
  })
  gender: Gender;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Exclude()
  @Column({
    nullable: false,
    transformer: new BCryptTransformer(),
  })
  password: string;

  @Column({
    type: 'date',
  })
  birthday: Date;

  @Column({
    nullable: true,
  })
  lastDateLogin: Date;

  @Column({
    enum: [Role.ADMIN, Role.EMPLOYEE, Role.DEFAULT],
  })
  role: Role;

  @OneToMany(
    () => Product,
    product => product.createdBy,
  )
  products: Product[];

  @ManyToMany(
    () => Invoice,
    invoice => invoice.sellers,
  )
  madeInvoices: Invoice[];

  @ManyToMany(
    () => Invoice,
    invoice => invoice.buyers,
  )
  purchasedInvoices: Invoice[];
}
