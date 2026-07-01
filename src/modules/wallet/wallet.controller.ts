import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import updateWalletDto from './dto/update-wallet.dto';
import createWalletDto from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @UseGuards(JwtAuthGuard)
  @Get("")
  getWallets(@Req() req: any) {
    const userId = req.user._id.toString();
    return this.walletService.getWallets(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getWalletById(@Req() req: any, @Param('id') walletId: string) {
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException('Không tìm thấy ví!');
    }
    if (wallet.user_id.toString() !== req.user._id.toString()) {
      throw new ForbiddenException('Bạn không có quyền truy cập ví này!');
    }
    return wallet;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addWallet(@Req() req: any, @Body() data: createWalletDto) {
    const dataPay = {
      ...data,
      user_id: req.user._id.toString()
    };
    const newWallet = await this.walletService.addWallet(dataPay);
    if (!newWallet) {
      throw new NotFoundException("Không thêm ví được");
    }
    return newWallet;
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async updateWallet(@Req() req: any, @Param("id") walletId: string, @Body() data: updateWalletDto) {
    const wallet = await this.walletService.getWalletById(walletId);
    if (!wallet) {
      throw new NotFoundException("Không tìm thấy ví");
    }
    if (req.user._id.toString() !== wallet.user_id.toString()) {
      throw new ForbiddenException("Bạn không có quyền sửa thông tin ví này");
    }
    const walletUpdate = await this.walletService.updateWallet(walletId, data);
    if (!walletUpdate) {
      throw new NotFoundException("Lỗi update");
    }
    return walletUpdate;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteWallet(@Param("id") id: string, @Req() req: any) {
    const wallet = await this.walletService.getWalletById(id);
    if (!wallet) {
      throw new NotFoundException("Không tìm thấy ví");
    }
    if (req.user._id.toString() !== wallet.user_id.toString()) {
      throw new ForbiddenException("Bạn không có quyền xóa thông tin ví này");
    }
    return await this.walletService.deleteWallet(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update-active/:id")
  async updateActive(@Param("id") id: string, @Req() req: any, @Body("is_active") isActive: boolean) {
    const wallet = await this.walletService.getWalletById(id);
    if (!wallet) {
      throw new NotFoundException("Không tìm thấy ví");
    }
    if (req.user._id.toString() !== wallet.user_id.toString()) {
      throw new ForbiddenException("Bạn không có quyền cập nhật trạng thái ví này");
    }
    const walletUpdate = await this.walletService.updateStatus(id, isActive);
    if (!walletUpdate) {
      throw new NotFoundException("Lỗi cập nhật trạng thái");
    }
    return walletUpdate;
  }
}
