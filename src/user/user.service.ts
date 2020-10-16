import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { CrudService } from '../lib/crud-services/crud-services';
import { UserDto } from './user.dto';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }

  async getByUsernameAndPassword(username: string, password: string) {
    const user = await this.repo.findOne({
      select: [
        'id',
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'role',
      ],
      where: [{ username }, { email: username }],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  async isFollowing(currentUser: User, user: string): Promise<boolean> {
    const builder = this.repo.createQueryBuilder();

    return (
      (await builder
        .select('id')
        .from('user_followers', 'uf')
        .where('uf.user_id = :user AND uf.follower_id = :follower', {
          user: user,
          follower: currentUser.id,
        })
        .getCount()) > 0
    );
  }

  async createUser(dto: UserDto) {
    const user = await this.repo.save(dto);

    return user;
  }

  async follow(currentUser: User, user: string): Promise<any> {
    if (currentUser.id == user) {
      this.throwBadRequestException('Você não pode seguir a sí mesmo!');
    }

    const builder = this.repo.createQueryBuilder();

    await builder
      .relation('followers')
      .of(user)
      .add(currentUser.id);

    return this.countFollowers(user);
  }

  public countFollowers(user: string) {
    const builder = this.repo.createQueryBuilder();

    return builder
      .select('id')
      .from('user_followers', 'uf')
      .where('uf.user_id = :user', {
        user: user,
      })
      .getCount();
  }

  async unfollow(currentUser: User, user: string): Promise<any> {
    if (currentUser.id == user) {
      this.throwBadRequestException('Você não pode seguir a sí mesmo!');
    }

    const builder = this.repo.createQueryBuilder();

    await builder
      .relation('followers')
      .of(user)
      .remove(currentUser.id);

    return this.countFollowers(user);
  }

  async setAvatar(avatar: File, user: User) {
    await this.repo.save({
      id: user.id,
      avatar: avatar,
    });
    return avatar;
  }
}
