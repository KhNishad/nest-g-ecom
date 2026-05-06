import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/createCategorySchema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { generateSlug } from 'src/utils/slug.utlis';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

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

  async getCategoryList(query: {
    page: number;
    limit: number;
    search: string;
  }) {
    let page = query.page || 1;
    let limit = query.limit || 10;
    let search = query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const categories = await this.categoryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return {
      message: 'Categories fetched successfully',
      data: categories,
      success: true,
    };
  }

  async getSingleCategory(id: string) {
    
    if(!isValidObjectId(id)){
      throw new BadRequestException('Invalid Category ID');
    }

    const category = await this.categoryModel.findById({ _id: id });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    return {
      message: 'Category fetched successfully',
      data: category,
      success: true,
    };
  }
}
