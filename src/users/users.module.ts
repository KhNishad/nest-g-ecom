import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/userSchema';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],

})
export class UsersModule { }
