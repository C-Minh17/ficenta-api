import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import createBudgetDto from './dto/create-budget.dto';
import updateBudgetDto from './dto/update-budget.dto';

@UseInterceptors(TransformResponseInterceptor)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: any, @Query('month') month: string, @Query('year') year: string) {
    const userId = req.user._id.toString()
    return this.budgetService.getAllBudget(userId, month, year)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() data: createBudgetDto) {
    const userId = req.user._id.toString()
    const datapay = {
      ...data,
      user_id: userId
    }
    return this.budgetService.createBudget(datapay)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  update(@Req() req: any, @Body() data: updateBudgetDto, @Param("id") id: string) {
    const userId = req.user._id.toString()
    return this.budgetService.updateBudget(userId, id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  delete(@Req() req: any, @Param("id") id: string) {
    const userId = req.user._id.toString()
    return this.budgetService.deleteBudget(userId, id)
  }
}
