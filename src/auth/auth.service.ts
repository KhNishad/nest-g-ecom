// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';   // ← mongoose, not typeorm
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/userSchema';
import { LoginDto } from '../auth/dto/auth.dto';
import { CustomerDocument, Customer } from 'src/customers/schemas/customerSchema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,

        private jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        // Step 1: Find user by phone in MongoDB
        const user = await this.userModel.findOne({ phone: dto.phone });

        // Step 2: If user not found
        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        // Step 3: Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials P');
        }

        // Step 4: Create token payload
        const payload = {
            sub: user._id,        // MongoDB uses _id not id
            phone: user.phone,
            role: user.role,
        };

        // Step 5: Return token
        return {
            data: {
                accessToken: this.jwtService.sign(payload),
            },
            success: true,
            message: 'Login Successfull'

        };
    }

    async customerLogin(body: LoginDto) {
        const user = await this.customerModel.findOne({ phone: body.phone });

        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        } 
        console.log('====================================user',user,body.password);
 

        const isPasswordValid = await bcrypt.compare(body.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials P');
        }

        const payload = {
            sub: user._id,
            phone: user.phone,
        };

        return {
            data: {
                accessToken: this.jwtService.sign(payload),
            },
            success: true,
            message: 'Login Successfull'

        };
    }
}