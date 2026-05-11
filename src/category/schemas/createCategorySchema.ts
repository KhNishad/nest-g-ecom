import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;

@Schema({ versionKey: false,timestamps: true })
export class Category {
    @Prop({ required: true, index: true })
    name!: string;

    @Prop({ required: true, index: true, unique: true })
    slug!: string;

    @Prop()
    image!: string;

    @Prop()
    description!: string;

    @Prop({ default: true })
    active!: boolean

    @Prop({ default: false })
    featured!: boolean

    @Prop()
    position!: number

    @Prop({default: false})
    isDeleted!:boolean


}

export const CategorySchema = SchemaFactory.createForClass(Category);