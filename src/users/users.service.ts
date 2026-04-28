import { Injectable, BadRequestException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/userSchema';
import { CreateUserDto } from './dto/userCreate.dto';
import * as bcrypt from 'bcrypt';
import { saveBase64Image, deleteImage } from '../helpers/base64imageUpload';
import { isValidObjectId } from 'mongoose';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) { }

    async userRegister(createUserDto: CreateUserDto) {
        const { name, phone, password, img, address } = createUserDto;

        // 1. Check if user already exists
        const existingUser = await this.userModel.findOne({ phone });

        if (existingUser) {
            throw new BadRequestException('Phone already registered');
        }
        const { filePath } = saveBase64Image(img, 'public/userImg');


        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await this.userModel.create({
            name,
            phone,
            img: filePath,
            address,
            password: hashedPassword,
        });

        return {
            message: 'User registered successfully',
            userId: user._id,
        };

    }

    async getSingleUser(id: string) {

        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid MongoDB ID');
        }

        const userData = await this.userModel.findById({ _id: id })


        if (!userData) {
            throw new BadRequestException('User Not found');
        }

        return {
            data: {
                data: userData,
                message: 'User Data Found',
                success: true
            }
        }
    }

    
    async getProfile(id:string) {


        const userData = await this.userModel.findById(id).select('-password ').lean()


        if (!userData) {
            throw new BadRequestException('Profile Not found');
        }

        return {
            data: {
                data: userData,
                message: 'Profile Found',
                success: true
            }
        }
    }


}
