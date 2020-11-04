import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, Override } from '@nestjsx/crud';
import {
  CurrentUser,
  OAuthActionsScope,
} from 'src/lib/decorators/oauth.decorator';
import { User } from 'src/user/user.entity';
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
  query: {
    join: {
      installments: {
        exclude: [],
      },
      sellers: {
        exclude: []
      },
      buyers: {
        exclude: []
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
export class InvoiceController {
  constructor(public readonly service: InvoiceService) {}

  @Post('')
  async createOne(@Body() body: Invoice, @CurrentUser() user: User) {
    const totalInstallments: number = body.installments.reduce(
      (acc, value) => acc + value.price,
      0,
    );

    body.total = totalInstallments;
    body.sellers = [{ id: user.id } as User];
    
    return await this.service.createOneInvoice(body);
  }
}
