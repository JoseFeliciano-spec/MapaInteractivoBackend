import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserController } from '@/context/auth/infrastructure/http-api/v1/create-user.ts/create-user.controller';
import { InMemoryUserRepository } from '@/context/auth/infrastructure/repositories/in-memory-user-repository';
import { UserRepository } from '@/context/auth/domain/user.repository';
import { CreateUserUseCase } from '@/context/auth/application/create-user-use-case/create-user.use-case';
import { UserMongo, UserSchema } from '@/context/auth/infrastructure/schema/user.schema';
import { LoginUserController } from './http-api/v1/login-user.ts/login-user.controller';
import { LoginUserUseCase } from '../application/login-user-use-case/login-user.use-case';
import { GetUserController } from './http-api/v1/get-user.ts/get-user.controller';
import { GetUserUseCase } from '../application/get-user-use-case/get-user.use-case';
import { CreateUserDriverController } from './http-api/v1/create-user-driver.ts/create-user.controller';
import {
  VehicleMongo,
  VehicleMongoSchema,
} from '@/context/maps/infrastructure/schema/vehicle.schema';
import { DriverMongo, DriverMongoSchema } from '@/context/maps/infrastructure/schema/driver.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMongo.name, schema: UserSchema },
      { name: DriverMongo.name, schema: DriverMongoSchema }, // AGREGADO
      { name: VehicleMongo.name, schema: VehicleMongoSchema }, // AGREGADO
    ]),
  ],
  controllers: [
    CreateUserController,
    LoginUserController,
    GetUserController,
    CreateUserDriverController,
  ],
  providers: [
    CreateUserUseCase,
    LoginUserUseCase,
    GetUserUseCase,
    InMemoryUserRepository,
    {
      provide: UserRepository,
      useExisting: InMemoryUserRepository,
    },
  ],
  exports: [CreateUserUseCase, LoginUserUseCase, GetUserUseCase],
})
export class AuthModule {}
