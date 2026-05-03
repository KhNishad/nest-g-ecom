import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CustomerDocument = Customer & Document;

@Schema({ versionKey: false })
export class Customer {
  @Prop({ required: true , index: true})
  name!: string;

  @Prop({ required: true , index: true, unique: true})
  phone!: string;
  
  @Prop({required: true, allowEmpty: true})
  password!: string;

  @Prop()
  img!: string;

  @Prop()
  district!: string;

  @Prop()
  city!: string;

  @Prop()
  address!: string;

  @Prop({default:true})
  active!: boolean

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);