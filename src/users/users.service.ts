import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/userSchema';
import { CreateUserDto } from './dto/userCreate.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) { }

    async userRegister(createUserDto: CreateUserDto) {
        try {
            const { name, phone, password, img, address } = createUserDto;

            // 1. Check if user already exists
            const existingUser = await this.userModel.findOne({ phone });

            if (existingUser) {
                throw new BadRequestException('Phone already registered');
            }

            // 2. Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Create user
            const user = await this.userModel.create({
                name,
                phone,
                img,
                address,
                password: hashedPassword,
            });

            return {
                message: 'User registered successfully',
                userId: user._id,
            };

        } catch (error:any) {
            console.error('Registration error:', error);
            // Handle known Mongo duplicate error (extra safety)
            if (error.code === 11000) {
                throw new BadRequestException('Phone already exists');
            }
            // Generic fallback
            throw new Error('Something went wrong during registration');
        }
    }


}
