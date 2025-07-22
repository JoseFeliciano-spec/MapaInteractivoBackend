import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleMongo, VehicleMongoSchema } from '../schema/vehicle.schema'; // Ajusta el path según tu estructura (asumiendo similar a driver.schema)
import { VehicleController } from '../http-api/v1/crud-vehicle.ts/crud-vehicle.controller'; // Ajusta el path según tu estructura
import { VehicleUseCases } from '../../application/crud-vehicle-use-case/crud-vehicle.use-case'; // Ajusta el path según tu estructura
import { InMemoryCrudVehicleRepository } from '../repositories/vehicle/in-memory-crud-product-repository'; // Ajusta el path según tu estructura
import { VehicleRepository } from '@/context/maps/domain/vehicle/vehicle.repository'; // Ajusta el path según tu estructura
import {
  NotificationMongo,
  NotificationMongoSchema,
} from '@/context/maps/infrastructure/schema/notifier.schema'; // Ajusta el path según tu estructura

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VehicleMongo.name, schema: VehicleMongoSchema }]),
    MongooseModule.forFeature([{ name: NotificationMongo.name, schema: NotificationMongoSchema }]),
  ],
  controllers: [VehicleController],
  providers: [
    VehicleUseCases,
    InMemoryCrudVehicleRepository,
    {
      provide: VehicleRepository,
      useExisting: InMemoryCrudVehicleRepository,
    },
  ],
  exports: [VehicleUseCases],
})
export class VehicleModule {}
