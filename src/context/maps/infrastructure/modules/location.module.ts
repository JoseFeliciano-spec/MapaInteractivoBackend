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
import {
  NotificationMongo,
  NotificationMongoSchema,
} from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo esquema para notificaciones, ajusta si es necesario

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LocationMongo.name, schema: LocationMongoSchema }]),
    MongooseModule.forFeature([{ name: NotificationMongo.name, schema: NotificationMongoSchema }]),
  ],
  controllers: [LocationController],
  providers: [
    LocationUseCases,
    InMemoryCrudLocationRepository,
    LocationGateway, // Aquí se integra el WebSocket Gateway como provider para inyección de dependencias
    {
      provide: LocationRepository,
      useExisting: InMemoryCrudLocationRepository,
    },
  ],
  exports: [LocationUseCases, LocationGateway], // Exporta el gateway si necesitas usarlo en otros módulos (ej: para inyección cross-module)
})
export class LocationModule {}
