import { HttpStatus, Injectable } from '@nestjs/common';
import { DriverMongo } from '@/context/maps/infrastructure/schema/driver.schema'; // Ajustado al contexto de driver estándar
import { DriverRepository } from '@/context/maps/domain/driver.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Driver, PrimitiveDriver } from '@/context/maps/domain/driver.entity';
import { NotificationMongo } from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo esquema para notificaciones

@Injectable()
export class InMemoryCrudDriverRepository extends DriverRepository {
  @InjectModel(DriverMongo.name)
  private driverModel: Model<DriverMongo>;

  @InjectModel(NotificationMongo.name)
  private notificationModel: Model<NotificationMongo>;

  constructor(private jwtService: JwtService) {
    super();
  }

  async create(driver: Driver): Promise<PrimitiveDriver> {
    try {
      const driverData = driver.toPrimitives();

      const newDriver = new this.driverModel({
        ...driverData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedDriver = await newDriver.save();

      return {
        id: savedDriver._id.toString(),
        name: savedDriver.name,
        license: savedDriver.license,
        assignedVehicle: savedDriver.assignedVehicle,
      };
    } catch (error) {
      throw new Error('Error al crear el conductor: ' + error.message);
    }
  }

  async getAll(): Promise<PrimitiveDriver[]> {
    try {
      const drivers = await this.driverModel.find().exec();

      // Filtrar conductores sin vehículo asignado (análogo a alertas predictivas en la prueba técnica)
      const driversWithoutVehicle = drivers.filter((driver) => !driver.assignedVehicle);

      // Guardar notificaciones para alertas (alineado con requisitos de alertas predictivas)
      for (const driver of driversWithoutVehicle) {
        const existingNotification = await this.notificationModel.findOne({
          driverId: driver._id,
        });

        if (!existingNotification) {
          await new this.notificationModel({
            driverId: driver._id,
            status: 'Sin vehículo asignado',
          }).save();
        }
      }

      return drivers.map((driver) => ({
        id: driver._id.toString(),
        name: driver.name,
        license: driver.license,
        assignedVehicle: driver.assignedVehicle,
      }));
    } catch (error) {
      throw new Error('Error al obtener los conductores: ' + error.message);
    }
  }

  async update(driver: Driver): Promise<PrimitiveDriver> {
    try {
      const driverData = driver.toPrimitives();

      const updatedDriver = await this.driverModel.findByIdAndUpdate(
        driverData.id,
        {
          ...driverData,
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!updatedDriver) {
        throw new Error('Conductor no encontrado');
      }

      return {
        id: updatedDriver._id.toString(),
        name: updatedDriver.name,
        license: updatedDriver.license,
        assignedVehicle: updatedDriver.assignedVehicle,
      };
    } catch (error) {
      throw new Error('Error al actualizar el conductor: ' + error.message);
    }
  }

  async deleteDriver(id: string): Promise<any> {
    try {
      const deletedDriver = await this.driverModel.findByIdAndDelete(id);

      if (!deletedDriver) {
        return {
          message: 'Conductor no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Conductor eliminado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: deletedDriver._id,
        },
      };
    } catch (error) {
      throw new Error('Error al eliminar el conductor: ' + error.message);
    }
  }

  async getDriverById(id: string): Promise<any> {
    try {
      const driver = await this.driverModel.findById(id);

      if (!driver) {
        return null;
      }

      return {
        id: driver._id.toString(),
        name: driver.name,
        license: driver.license,
        assignedVehicle: driver.assignedVehicle,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt,
      };
    } catch (error) {
      throw new Error('Error al obtener el conductor: ' + error.message);
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const driver = await this.driverModel.findById(id);

      if (!driver) {
        return {
          message: 'Conductor no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Conductor recuperado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: driver._id.toString(),
          name: driver.name,
          license: driver.license,
          assignedVehicle: driver.assignedVehicle,
          createdAt: driver.createdAt,
          updatedAt: driver.updatedAt,
        },
      };
    } catch (error) {
      throw new Error('Error al obtener el conductor: ' + error.message);
    }
  }
}
