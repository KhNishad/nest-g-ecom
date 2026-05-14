import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ versionKey: false, timestamps: true })

export class Brand {
  @Prop({ required: true, index: true })
  name!: string;

  @Prop({ required: true, index: true })
  slug!: string;

  @Prop()
  image!: string;

  @Prop()
  description!: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
