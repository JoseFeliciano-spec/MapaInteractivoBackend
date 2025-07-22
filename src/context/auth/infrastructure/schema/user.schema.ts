import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserMongo>;

@Schema({ collection: 'users' })
export class UserMongo {
  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop()
  password?: string;

  @Prop({
    type: String,
    enum: ['admin', 'driver'], // Restringe valores a 'admin' o 'driver'
    default: 'admin', // Por defecto 'admin' para usuarios de administración
  })
  role: 'admin' | 'driver';

  @Prop()
  createdAt?: string;

  @Prop()
  updatedAt?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserMongo);
