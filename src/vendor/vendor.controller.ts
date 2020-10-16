import {
  Controller,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.entity';
import {
  Crud,
} from '@nestjsx/crud';
import {
  OAuthActionsScope,
} from '../lib/decorators/oauth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Vendors')
@Controller('vendors')
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
    type: Vendor,
  },
  params: {
    id: {
      type: 'string',
      field: 'id',
      primary: true,
    },
  },
})
export class VendorController {
  constructor(
    public readonly service: VendorService,
  ) {}

}
