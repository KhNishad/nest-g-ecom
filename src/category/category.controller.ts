import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoryService.createCategory(body);
  }

  @Get('/get-list')
  @UseGuards(AuthGuard('jwt'))
  getCategoryList(
    @Query() query: { page: number; limit: number; search: string },
  ) {
    return this.categoryService.getCategoryList(query);
  }

  @Get('/single-category/:id')
  @UseGuards(AuthGuard('jwt'))
  getSingleCategory(@Param('id') id: string) {
    return this.categoryService.getSingleCategory(id);
  }

  
}
