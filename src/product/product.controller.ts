import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { OAuthPublic } from 'src/lib/decorators/oauth.decorator';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
@OAuthPublic()
@Crud({
  model: {
    type: Product,
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
