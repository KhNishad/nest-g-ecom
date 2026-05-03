import { CustomerSchema,Customer } from './schemas/customerSchema';
import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserSchema ,User } from 'src/users/schemas/userSchema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Otp, OtpSchema } from 'src/auth/schemas/otpSchema';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService,AuthService],
  imports:[ PassportModule,
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '7d' },
        }),
      }),MongooseModule.forFeature([{name : Customer.name, schema: CustomerSchema},{name : User.name ,schema :UserSchema},{name : Otp.name, schema : OtpSchema}])]
})
export class CustomersModule {}
