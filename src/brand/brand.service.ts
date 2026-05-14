import { ConflictException, Injectable } from '@nestjs/common';
import { Brand, BrandDocument } from './schemas/brandSchema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBrandDto } from './dto/createBrand.dto';
import { generateSlug } from 'src/utils/slug.utlis';
import { saveBase64Image, deleteImage } from 'src/helpers/base64imageUpload';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
  ) {}

  async createBrand(body: CreateBrandDto) {
    const slug = generateSlug(body.name);
    const existingBrand = await this.brandModel.findOne({ slug });
    if (existingBrand) {
      throw new ConflictException(`Brand "${body.name}" already exists`);
    }

    let imageUrl = '';
    if (body.image) {
      const file = await saveBase64Image(body.image, 'public/brand');
      imageUrl = file.filePath;
    }

    try {
      const brand = await this.brandModel.create({
        ...body,
        slug,
        image: imageUrl,
      });

      return {
        message: 'Brand created successfully',
        data: brand,
        success: true,
      };
    } catch (error) {
      if (imageUrl) {
        try {
          await deleteImage(imageUrl);
          console.log('Image deleted on brand creation failure');
        } catch (deleteError) {
          console.error('Failed to delete image:', deleteError);
        }
      }

      throw error;
    }
  }

  async getBrandList(query: { page: number; limit: number; search: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter = query.search
      ? {
          $or: [
            {
              name: { $regex: query.search, $options: 'i' },
            },
            { slug: { $regex: query.search, $options: 'i' } },
            { isDeleted: false },
          ],
        }
      : {};

    const [brandList, total] = await Promise.all([
      this.brandModel.find(filter).skip(skip).limit(limit),
      this.brandModel.countDocuments(filter),
    ]);
    return {
      message: 'Brand List',
      data: brandList,
      success: true,
      total,
    };
  }
}
