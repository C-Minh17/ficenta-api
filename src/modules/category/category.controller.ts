import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import createCategoryDto from './dto/create-category.dto';
import updateCategoryDto from './dto/update-category.dto';


@UseInterceptors(TransformResponseInterceptor)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCategories(@Req() req: any) {
    const data = await this.categoryService.getCategories(req.user._id.toString())
    if (!data) {
      throw new NotFoundException("Không tìm thấy danh sách danh mục")
    }
    return data
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Req() req: any, @Body() data: createCategoryDto) {
    const dataPay = {
      ...data,
      user_id: req.user._id.toString(),
    }
    const res = await this.categoryService.createCategory(dataPay)
    if (!res) {
      throw new NotFoundException("Không thêm được danh mục")
    }

    return res
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async updateCategory(@Req() req: any, @Param("id") id: string, @Body() data: updateCategoryDto) {
    const category = await this.categoryService.getCategoryById(id)
    if (!category) {
      throw new NotFoundException("Không tìm được danh mục")
    }
    if (category.is_default || !category.user_id || category.user_id.toString() !== req.user._id.toString()) {
      throw new ForbiddenException("Tài khoản không được phép thực hiện thao tác này");
    }
    const res = await this.categoryService.updateCategory(id, data)
    if (!res) {
      throw new NotFoundException("Không sửa được danh mục")
    }

    return res
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async deleteCategory(@Req() req: any, @Param("id") id: string) {
    const category = await this.categoryService.getCategoryById(id)
    if (!category) {
      throw new NotFoundException("Không tìm được danh mục")
    }
    if (category.is_default || !category.user_id || category.user_id.toString() !== req.user._id.toString()) {
      throw new ForbiddenException("Tài khoản không được phép thực hiện thao tác này");
    }
    const res = await this.categoryService.deleteCategory(id)
    if (!res) {
      throw new NotFoundException("Không xóa được danh mục")
    }

    return res
  }
}
