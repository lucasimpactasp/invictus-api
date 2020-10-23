import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { Installment } from './installment.entity';
import { InstallmentService } from './installment.service';

@ApiTags('Installment')
@Controller('installment')
@OAuthActionsScope({
  'Create-Many': ['admin', 'employee'],
  'Create-One': ['admin', 'employee'],
  'Update-One': ['admin', 'employee'],
  'Delete-All': ['admin', 'employee'],
  'Delete-One': ['admin', 'employee'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin', 'employee'],
})
@Crud({
  model: {
    type: Installment,
  },
  params: {
    id: {
      type: 'string',
      field: 'id',
      primary: true,
    },
  },
})
export class InstallmentController {
  constructor(public readonly service: InstallmentService) {}
}
