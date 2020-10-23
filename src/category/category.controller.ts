import { Controller, Get } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { Crud, CrudRequest, GetManyDefaultResponse, ParsedRequest } from '@nestjsx/crud';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('category')
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
    type: Category,
  },
  query: {
    join: {
      products: {
        exclude: ['id'],
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
export class CategoryController {
  constructor(public readonly service: CategoryService) {}
}
