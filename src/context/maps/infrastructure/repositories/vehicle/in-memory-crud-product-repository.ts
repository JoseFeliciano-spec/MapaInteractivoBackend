import { HttpStatus, Injectable } from '@nestjs/common';
import { VehicleMongo } from '@/context/maps/infrastructure/schema/vehicle.schema'; // Ajusta el path según tu estructura
import { VehicleRepository } from '@/context/maps/domain/vehicle/vehicle.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Vehicle } from '@/context/maps/domain/vehicle/vehicle..entity';
import { NotificationMongo } from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo un esquema similar para notificaciones

@Injectable()
export class InMemoryCrudVehicleRepository extends VehicleRepository {
  @InjectModel(VehicleMongo.name)
  private vehicleModel: Model<VehicleMongo>;

  @InjectModel(NotificationMongo.name)
  private notificationModel: Model<NotificationMongo>;

  constructor(private jwtService: JwtService) {
    super();
  }

  async registerVehicle(vehicle: Vehicle): Promise<any> {
    try {
      const vehicleData = vehicle.toPrimitives();

      const newVehicle = new this.vehicleModel({
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedVehicle = await newVehicle.save();

      return {
        message: 'Vehículo registrado correctamente',
        statusCode: HttpStatus.CREATED,
        data: {
          id: savedVehicle._id,
          model: savedVehicle.model,
          plate: savedVehicle.plate,
          fuelLevel: savedVehicle.fuelLevel,
          assignedDriver: savedVehicle.assignedDriver,
          latitude: savedVehicle.latitude,
          longitude: savedVehicle.longitude,
          timestamp: savedVehicle.timestamp,
        },
      };
    } catch (error) {
      throw new Error('Error al registrar el vehículo: ' + error.message);
    }
  }

  async deleteVehicle(id: string): Promise<any> {
    try {
      const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id);

      if (!deletedVehicle) {
        return {
          message: 'Vehículo no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Vehículo eliminado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: deletedVehicle._id,
        },
      };
    } catch (error) {
      throw new Error('Error al eliminar el vehículo: ' + error.message);
    }
  }

  async getAllVehicles(): Promise<any> {
    try {
      // Obtener todos los vehículos
      const vehicles = await this.vehicleModel.find().exec();

      // Filtrar vehículos con nivel de combustible bajo (<= 10% asumiendo escala 0-100)
      const vehiclesWithLowFuel = vehicles.filter((vehicle) => vehicle.fuelLevel <= 10);

      // Guardar en NotificationMongo si no existen notificaciones previas
      for (const vehicle of vehiclesWithLowFuel) {
        const existingNotification = await this.notificationModel.findOne({
          vehicleId: vehicle._id,
        });

        if (!existingNotification) {
          await new this.notificationModel({
            vehicleId: vehicle._id,
            remainingFuel: vehicle.fuelLevel,
          }).save();
        }
      }

      return {
        message: vehiclesWithLowFuel.length
          ? `Atención: Hay vehículos con combustible bajo (${vehiclesWithLowFuel
              .map((v) => `${v.model} (${v.fuelLevel}% combustible)`)
              .join(', ')})`
          : 'Vehículos recuperados correctamente',
        statusCode: HttpStatus.OK,
        data: vehicles.map((vehicle) => ({
          id: vehicle._id,
          model: vehicle.model,
          plate: vehicle.plate,
          fuelLevel: vehicle.fuelLevel,
          assignedDriver: vehicle.assignedDriver,
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
          timestamp: vehicle.timestamp,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        })),
      };
    } catch (error) {
      throw new Error('Error al obtener los vehículos: ' + error.message);
    }
  }

  async getVehicleById(id: string): Promise<any> {
    try {
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        return null;
      }

      return {
        id: vehicle._id,
        model: vehicle.model,
        plate: vehicle.plate,
        fuelLevel: vehicle.fuelLevel,
        assignedDriver: vehicle.assignedDriver,
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        timestamp: vehicle.timestamp,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      };
    } catch (error) {
      throw new Error('Error al obtener el vehículo: ' + error.message);
    }
  }

  async updateVehicle(vehicle: Vehicle): Promise<any> {
    try {
      const vehicleData = vehicle.toPrimitives();

      const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
        vehicleData.id,
        {
          ...vehicleData,
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!updatedVehicle) {
        return {
          message: 'Vehículo no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Vehículo actualizado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: updatedVehicle._id,
          model: updatedVehicle.model,
          plate: updatedVehicle.plate,
          fuelLevel: updatedVehicle.fuelLevel,
          assignedDriver: updatedVehicle.assignedDriver,
          latitude: updatedVehicle.latitude,
          longitude: updatedVehicle.longitude,
          timestamp: updatedVehicle.timestamp,
          updatedAt: updatedVehicle.updatedAt,
        },
      };
    } catch (error) {
      throw new Error('Error al actualizar el vehículo: ' + error.message);
    }
  }

  async getById(id: string): Promise<any> {
    try {
      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        return {
          message: 'Vehículo no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Vehículo recuperado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: vehicle._id,
          model: vehicle.model,
          plate: vehicle.plate,
          fuelLevel: vehicle.fuelLevel,
          assignedDriver: vehicle.assignedDriver,
          latitude: vehicle.latitude,
          longitude: vehicle.longitude,
          timestamp: vehicle.timestamp,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        },
      };
    } catch (error) {
      throw new Error('Error al obtener el vehículo: ' + error.message);
    }
  }
}
