import {
  Controller,
  Get,
  Post,
  Body, Put, Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  Crud,
} from '@nestjsx/crud';
import {
  OAuthPublic,
  OAuthActionsScope,
  CurrentUser,
} from '../lib/decorators/oauth.decorator';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { SanitizePipe } from '../lib/pipes/sanitize.pipe';
import { UserDto } from './user.dto';
import { Product } from '../product/product.entity';

@ApiTags('Users')
@Controller('users')
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
  query: {
    join: {
      madeInvoices: {
        exclude: [],
      },
    },
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
  constructor(public readonly service: UserService) {
  }

  @OAuthPublic()
  @Post()
  createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Get('bestSeller')
  public async getBestSeller() {
    return this.service.getBestSeller();
  }

  @Put(':id')
  async putOne(
    @Param('id') id: string,
    @Body() user: User,
  ) {
    return await this.service.updateUser(id, user);
  }

}
