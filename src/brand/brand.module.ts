import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brandSchema';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports:[MongooseModule.forFeature([{name:Brand.name , schema:BrandSchema}])]
})
export class BrandModule {}
