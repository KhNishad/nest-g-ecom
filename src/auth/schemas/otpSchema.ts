import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type OtpDocument = Otp & Document;

@Schema({ versionKey: false })
export class Otp {
    @Prop({ required: true, index: true, unique: true })
    phone!: string;
    @Prop({ required: true })
    otp!: string;
    
    @Prop({ default: Date.now, expires: 120 })
    otpExpiry!: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);