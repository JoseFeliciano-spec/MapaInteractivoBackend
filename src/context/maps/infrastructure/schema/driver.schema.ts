import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DriverMongo extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  license: string;

  @Prop({ required: false })
  assignedVehicle?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DriverMongoSchema = SchemaFactory.createForClass(DriverMongo);
