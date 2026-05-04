import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/createCategorySchema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { generateSlug } from 'src/utils/slug.utlis';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,) { }

    async createCategory(body: CreateCategoryDto) {

        const slug = generateSlug(body.name);

        const existingCategory = await this.categoryModel.findOne({ slug });
        if (existingCategory) {
            throw new ConflictException(`Category "${body.name}" already exists`);
        }

        const category = await this.categoryModel.create({ ...body, slug });
        return {
            message: 'Category created successfully',
            data: category,
            success: true,
        };
    }
}
