import { BadRequestException, Body, Controller, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { Installment, PaymentStatus } from './installment.entity';
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

  @Put('/pay/:id')
  @ApiOperation({ summary: 'Paga uma parcela' })
  async payInstallment(@Param('id') id: string, @Body() installment: Installment) {
    if (installment.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Installment já paga');
    }

    return this.service.payInstallment(id, installment);
  }
}
