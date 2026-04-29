import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CustomerDocument = Customer & Document;



@Schema({ versionKey: false })
export class Customer {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  password!: string;

  @Prop()
  img!: string;

  @Prop()
  address!: string;

  @Prop({default:true})
  status!: boolean

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);