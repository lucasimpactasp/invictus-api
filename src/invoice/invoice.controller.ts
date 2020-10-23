import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@ApiTags('Invoice')
@Controller('invoice')
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
    type: Invoice,
  },
  params: {
    id: {
      type: 'string',
      field: 'id',
      primary: true,
    }
  }
})
export class InvoiceController {
  constructor(public readonly service: InvoiceService) {}
}
