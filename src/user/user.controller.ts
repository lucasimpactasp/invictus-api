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
// @OAuthPublic()
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin'],
  'Read-One': ['admin'],
  'Replace-One': ['admin'],
})
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
  constructor(public readonly service: UserService) {}

  // @Override()
  @OAuthPublic()
  @Post()
  createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    console.log(user);
  }
}
