import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LocationMongo extends Document {
  @Prop({ required: true })
  vehicleId: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const LocationMongoSchema = SchemaFactory.createForClass(LocationMongo);
