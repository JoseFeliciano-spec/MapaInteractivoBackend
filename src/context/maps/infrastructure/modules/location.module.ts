import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LocationMongo,
  LocationMongoSchema,
} from '@/context/maps/infrastructure/schema/location.schema';
import { LocationController } from '@/context/maps/infrastructure/http-api/v1/crud-location.ts/crud-location.controller';
import { LocationUseCases } from '@/context/maps/application/crud-location-use-case/crud-location.use-case';
import { InMemoryCrudLocationRepository } from '@/context/maps/infrastructure/repositories/location/in-memory-crud-location-repository';
import { LocationRepository } from '@/context/maps/domain/location/location.repository';
import { LocationGateway } from '../websocket/location.gateway';
import { DriverMongo, DriverMongoSchema } from '@/context/maps/infrastructure/schema/driver.schema'; // Ajusta el path según tu estructura
import {
  NotificationMongo,
  NotificationMongoSchema,
} from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo esquema para notificaciones, ajusta según tu estructura
import { UserSchema, UserMongo } from '@/context/auth/infrastructure/schema/user.schema';
import { VehicleMongo, VehicleMongoSchema } from '../schema/vehicle.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserMongo.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: DriverMongo.name, schema: DriverMongoSchema }]),
    MongooseModule.forFeature([{ name: NotificationMongo.name, schema: NotificationMongoSchema }]),
    MongooseModule.forFeature([{ name: VehicleMongo.name, schema: VehicleMongoSchema }]),
    MongooseModule.forFeature([{ name: LocationMongo.name, schema: LocationMongoSchema }]),
  ],
  controllers: [LocationController],
  providers: [
    LocationUseCases,
    InMemoryCrudLocationRepository,
    {
      provide: LocationRepository,
      useExisting: InMemoryCrudLocationRepository,
    },
    LocationGateway, // Aquí se integra el WebSocket Gateway como provider para inyección de dependencias
  ],
  exports: [LocationUseCases, LocationGateway], // Exporta el gateway si necesitas usarlo en otros módulos (ej: para inyección cross-module)
})
export class LocationModule {}
