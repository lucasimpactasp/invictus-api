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
  'Create-Many': ['users.create'],
  'Create-One': ['users.create'],
  'Update-One': ['users.update'],
  'Delete-All': ['users.delete'],
  'Delete-One': ['users.delete'],
  'Read-All': ['users.read'],
  'Read-One': ['users.read', 'public'],
  'Replace-One': ['users.update'],
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
