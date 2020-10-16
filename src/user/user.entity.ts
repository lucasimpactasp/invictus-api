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

export type Gender = 'M' | 'F';
export enum Role {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
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
    enum: [Role.ADMIN, Role.EMPLOYEE],
  })
  role: Role;

  // @ManyToMany(() => User, user => user.following)
  // @JoinTable({
  //   name: 'user_followers',
  //   joinColumn: {
  //     name: 'user_id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'follower_id',
  //   },
  // })
  // followers: User[];

  // @ManyToMany(() => User, user => user.followers)
  // following: User[];

  // @RelationCount('followers')
  // followersCount: number;

  // @RelationCount('following')
  // followingCount: number;
}
