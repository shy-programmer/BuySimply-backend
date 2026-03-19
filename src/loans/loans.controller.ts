import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get('loans')
  getAll(@Query('status') status: string, @Req() req: any) {
    return this.loansService.getAll(status, req.user.role);
  }

  @Get('loans/expired')
  getExpired(@Req() req: any) {
    return this.loansService.getExpired(req.user.role);
  }

  @Get('loans/:userEmail/get')
  getByEmail(@Param('userEmail') email: string, @Req() req: any) {
    return this.loansService.getByEmail(email, req.user.role);
  }

  @Delete('loan/:loanId/delete')
  delete(@Param('loanId') loanId: string, @Req() req: any) {
    return this.loansService.delete(loanId, req.user.role);
  }
}