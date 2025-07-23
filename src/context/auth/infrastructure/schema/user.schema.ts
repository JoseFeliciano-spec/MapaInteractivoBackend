import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<UserMongo>;

@Schema({ collection: 'users', timestamps: true })
export class UserMongo extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['admin', 'driver'],
    default: 'admin',
  })
  role: 'admin' | 'driver';

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'UserMongo',
    required: false,
    default: null,
  })
  userId?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserMongo);
