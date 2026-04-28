import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/commons/enums/role.enum';
export type UserDocument = User & Document;



@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  img!: string;

  @Prop()
  address!: string;

  @Prop({
    type: String,
    enum: Role,                
    default: Role.ADMIN, 
  })
  role!: string;

}

export const UserSchema = SchemaFactory.createForClass(User);