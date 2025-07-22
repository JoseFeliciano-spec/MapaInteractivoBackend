import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverController } from '@/context/maps/infrastructure/http-api/v1/crud-driver.ts/crud-driver.controller'; // Ajusta el path según tu estructura
import { DriverUseCases } from '@/context/maps/application/crud-driver-use-case/crud-driver.use-case'; // Ajusta el path según tu estructura
import { DriverRepository } from '@/context/maps/domain/driver.repository'; // Ajusta el path según tu estructura
import { InMemoryCrudDriverRepository } from '@/context/maps/infrastructure/repositories/in-memory-crud-driver-repository'; // Ajusta el path según tu estructura
import { DriverMongo, DriverMongoSchema } from '@/context/maps/infrastructure/schema/driver.schema'; // Ajusta el path según tu estructura
import {
  NotificationMongo,
  NotificationMongoSchema,
} from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo esquema para notificaciones, ajusta según tu estructura

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DriverMongo.name, schema: DriverMongoSchema }]),
    MongooseModule.forFeature([{ name: NotificationMongo.name, schema: NotificationMongoSchema }]),
  ],
  controllers: [DriverController],
  providers: [
    DriverUseCases,
    InMemoryCrudDriverRepository,
    {
      provide: DriverRepository,
      useExisting: InMemoryCrudDriverRepository,
    },
  ],
  exports: [DriverUseCases],
})
export class DriverModule {}
