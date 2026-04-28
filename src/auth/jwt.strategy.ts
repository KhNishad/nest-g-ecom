import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET is not defined in .env file'); 
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,
        });
    }

    async validate(payload: any) {
        // this gets attached to req.user in every protected route
        return {
            id: payload.sub,
            phone: payload.phone,
            role: payload.role,
        };
    }
}