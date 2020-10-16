import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import {
  OAuthActionsScope,
  OAuthPublic,
} from 'src/lib/decorators/oauth.decorator';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
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
    type: Product,
  },
  query: {
    join: {
      vendor: {
        allow: ['id', 'name', 'phone'],
      },
      category: {
        allow: ['id', 'name', 'slug'],
      }
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
export class ProductController {
  constructor(public readonly service: ProductService) {}
}
