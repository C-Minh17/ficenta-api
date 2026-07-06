import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import createTransactionDto from './dto/create-transaction.dto';
import updateTransactionDto from './dto/update-transaction.dto';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';

@UseInterceptors(TransformResponseInterceptor)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: any) {
    const userId = req.user._id.toString()
    return this.transactionService.getTransactionAll(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getById(@Req() req: any, @Param("id") id: string) {
    const userId = req.user._id.toString()
    return this.transactionService.getTransactionId(userId, id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() data: createTransactionDto) {
    const userId = req.user._id.toString()
    return this.transactionService.createTransaction(userId, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  update(@Req() req: any, @Param("id") id: string, @Body() data: updateTransactionDto) {
    const userId = req.user._id.toString()
    return this.transactionService.updateTransaction(userId, id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  delete(@Req() req: any, @Param("id") id: string) {
    const userId = req.user._id.toString()
    return this.transactionService.deleteTransaction(userId, id)
  }
}
