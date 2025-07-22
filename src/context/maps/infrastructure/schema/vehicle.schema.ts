import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VehicleMongo extends Document {
  @Prop({ required: true, unique: true })
  plate: string;

  @Prop({ required: true })
  modelCar: string;

  @Prop({ required: true })
  fuelLevel: number;

  @Prop({ required: false })
  assignedDriver?: string;

  @Prop({ required: false })
  latitude?: number;

  @Prop({ required: false })
  longitude?: number;

  @Prop({ required: false })
  timestamp?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VehicleMongoSchema = SchemaFactory.createForClass(VehicleMongo);
