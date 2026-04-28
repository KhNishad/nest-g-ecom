// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';   // ← mongoose, not typeorm
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/userSchema';
import { LoginDto } from '../auth/dto/auth.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)                  // ← inject mongoose model
        private userModel: Model<UserDocument>,  // ← Model, not Repository

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
}