import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseInterceptors,
  Scope,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  Crud,
  CrudRequestInterceptor,
  ParsedRequest,
  CrudRequest,
  Action,
  Override,
} from '@nestjsx/crud';
import {
  OAuthPublic,
  OAuthActionsScope,
  CurrentUser,
  OAuthScope,
} from '../lib/decorators/oauth.decorator';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { SanitizePipe } from '../lib/pipes/sanitize.pipe';
import { UserDto } from './user.dto';

@ApiTags('Users')
@Controller('users')
@OAuthPublic()
// @ApiOAuth2(['public'])
// @OAuthActionsScope({
//   'Create-Many': ['users.create'],
//   'Create-One': ['users.create'],
//   'Update-One': ['users.update'],
//   'Delete-All': ['users.delete'],
//   'Delete-One': ['users.delete'],
//   'Read-All': ['users.read'],
//   'Read-One': ['users.read', 'public'],
//   'Replace-One': ['users.update'],
// })
@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      type: 'string',
      field: 'id',
      primary: true,
    },
  },
})
export class UserController {
  constructor(
    public readonly service: UserService,
  ) {}

  // @Override()
  @OAuthPublic()
  @Post()
  createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }
}
