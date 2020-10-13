import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsIn } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User, Gender } from './user.entity';


export class UserDto {
  @IsString({ always: true })
  @Expose()
  firstName: string;

  @IsString({ always: true })
  @Expose()
  lastName: string;

  @IsIn(['M', 'F'], {
    always: true,
  })
  @IsString({ always: true })
  @Expose()
  gender: Gender;

  @IsEmail()
  @IsString({ always: true })
  @Expose()
  email: string;

  @IsString({ always: true })
  @Expose()
  username: string;

  @IsString({ always: true })
  @Expose()
  password: string;
  
  @IsString({ always: true })
  @Expose()
  birthday: string;
}
