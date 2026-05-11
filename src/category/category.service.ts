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
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { deleteImage, saveBase64Image } from 'src/helpers/base64imageUpload';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(body: CreateCategoryDto) {
    const slug = generateSlug(body.name);
    let imageUrl: string = '';

    const existingCategory = await this.categoryModel.findOne({ slug });
    if (existingCategory) {
      throw new ConflictException(`Category "${body.name}" already exists`);
    }
    try {
      if (body.image) {
        const file = await saveBase64Image(body.image, 'public/category');
        imageUrl = file.filePath;
      }

      const category = await this.categoryModel.create({
        ...body,
        slug,
        image: imageUrl,
      });
      return {
        message: 'Category created successfully',
        data: category,
        success: true,
      };
    } catch (error) {
      if (imageUrl) {
        try {
          await deleteImage(imageUrl);
          console.log('Image deleted');
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }

      throw error;
    }
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
      .find(filter, { isDeleted: 0 })
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
    if (!isValidObjectId(id)) {
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

  async updateCategory(id: string, body: UpdateCategoryDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Category Id');
    }
    const category = await this.categoryModel.findById({ _id: id });
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    let slug: string | undefined;

    if (body.name) {
      slug = generateSlug(body.name);
      const existingCategory = await this.categoryModel.findOne({
        slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        throw new ConflictException(`Category "${body.name}" already exists`);
      }
    }
    const updateCategory = await this.categoryModel.findByIdAndUpdate(
      { _id: id },
      { ...body, slug },
      { new: true },
    );
    return {
      message: 'Category updated successfully',
      data: updateCategory,
      success: true,
    };
  }
}
