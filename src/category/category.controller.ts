import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@ApiTags('Categories')
@Controller('category')
@Crud({
  model: {
    type: Category,
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
