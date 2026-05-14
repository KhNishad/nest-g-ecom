import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/createBrand.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('brand')
export class BrandController {
   constructor(private readonly brandService:BrandService){}


   @Post('/create-brand')
   @UseGuards(AuthGuard('jwt'))
   createBrand(@Body() body:CreateBrandDto){
    return this.brandService.createBrand(body)
   }

   @Get('/brand-list')
   @UseGuards(AuthGuard('jwt'))
   getBrandList(@Query() query: { page: number; limit: number; search: string }){
      return this.brandService.getBrandList(query)
   }



}
