import { LoginDto } from './../auth/dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { Customer, CustomerDocument } from './schemas/customerSchema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { saveBase64Image, deleteImage } from 'src/helpers/base64imageUpload';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customer.name)
        private customreModel: Model<CustomerDocument>,
    ) { }

    async customerRegister(body: CreateCustomerDto) {

        const { phone, img, password } = body
        const checkCustomer = await this.customreModel.findOne({ phone })

        if (checkCustomer) {
            throw new BadRequestException('This Phone Number is Already Registered')
        }

        let filePath: string | null = null;

        try {
            const result = saveBase64Image(img, 'public/customer');
            filePath = result.filePath;

            const hashedPassword = password
                ? await bcrypt.hash(password, 10)
                : '';

            const customer = await this.customreModel.create({
                ...body,
                phone,
                img: filePath,
                password: hashedPassword,
            });

            return {
                message: 'Customer registered successfully',
                customerId: customer._id,
                success: true,
            };

        } catch (error) {
            if (filePath) {
                try {
                    await deleteImage(filePath);
                    console.log('iamge deleted');

                } catch (err) {
                    console.error('Failed to delete image:', err);
                }
            }

            throw error;
        }


    }

    async getCustomers(query: { page: string; limit: string; search?: string }) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = query.search
            ? {
                $or: [
                    { name: { $regex: query.search, $options: 'i' } },
                    { phone: { $regex: query.search, $options: 'i' } },
                ],
            }
            : {};


        const [customerList, total] = await Promise.all([
            this.customreModel.find(filter).skip(skip).limit(limit),
            this.customreModel.countDocuments(filter),
        ]);

        if (!customerList) {
            throw new NotFoundException('Customer Not Found')
        }

        return {
            data: customerList,
            count: total,
            message: 'Customer list fetched',
            success: true
        }
    }



}
