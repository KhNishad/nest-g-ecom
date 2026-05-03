// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';   // ← mongoose, not typeorm
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/userSchema';
import { LoginDto } from '../auth/dto/auth.dto';
import { CustomerDocument, Customer } from 'src/customers/schemas/customerSchema';
import { OtpDocument, Otp } from './schemas/otpSchema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
        @InjectModel(Otp.name)
        private otpModel: Model<OtpDocument>,

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
        if (!user.password) {
            throw new UnauthorizedException('Set Password First');
        }


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

    async sendOtp(phone: string) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // upsert — create if not exists, update if exists
        await this.otpModel.findOneAndUpdate(
            { phone },
            { otp },
            { upsert: true, new: true }
        );

        console.log(`OTP for ${phone}: ${otp}`); // replace with real SMS gateway

        return { message: 'OTP sent', success: true };
    }

    async customerOtpLogin(phone: string, otp: string) {
        const otpRecord = await this.otpModel.findOne({ phone });

        if (!otpRecord || otpRecord.otp !== otp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // delete otp after verified
        await this.otpModel.deleteOne({ phone });

        // upsert customer
        const customer = await this.customerModel.findOneAndUpdate(
            { phone },
            { phone },
            { upsert: true, new: true }
        );

        const token = this.jwtService.sign({ id: customer._id, phone: customer.phone });

        return {
            token,
            isNewUser: !customer.name,
            message: 'Login successful',
            success: true,
        };
    }
}