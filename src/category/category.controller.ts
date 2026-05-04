import { Controller, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post('/create')
    createCategory(@Body() body: CreateCategoryDto) {
        return this.categoryService.createCategory(body)
    }





}
