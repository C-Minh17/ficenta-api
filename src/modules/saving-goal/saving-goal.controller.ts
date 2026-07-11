import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';
import createSavingGoalDto from './dto/create-saving-goal.dto';
import updateSavingGoalDto from './dto/update-saving-goal.dto';

@UseInterceptors(TransformResponseInterceptor)
@Controller('saving-goal')
export class SavingGoalController {
  constructor(private readonly savingGoalService: SavingGoalService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() req: any) {
    const userId = req.user._id.toString()
    return await this.savingGoalService.getSavingGoal(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() data: createSavingGoalDto) {
    const userId = req.user._id.toString()
    return await this.savingGoalService.createSavingGoal(userId, data)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async update(@Req() req: any, @Body() data: updateSavingGoalDto, @Param("id") id: string) {
    const userId = req.user._id.toString()

    return await this.savingGoalService.updateSavingGoal(userId, id, data)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async delete(@Req() req: any, @Param("id") id: string) {
    const userId = req.user._id.toString()

    return await this.savingGoalService.deleteSavingGoal(userId, id)
  }
}
