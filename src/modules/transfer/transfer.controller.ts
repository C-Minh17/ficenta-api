import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';
import createdTransferDto from './dto/create-transfer.dto';
import { WalletService } from '../wallet/wallet.service';

@UseInterceptors(TransformResponseInterceptor)
@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly walletService: WalletService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get("/histories")
  async historyTransfer(@Req() req: any) {
    const userId = req.user._id
    const transfers = await this.transferService.historyTransfer(userId)
    return transfers
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createdTransfer(@Req() req: any, @Body() data: createdTransferDto) {
    const userId = req.user._id.toString()
    const res = await this.transferService.createdTransfer(userId, data)
    return res
  }

}
