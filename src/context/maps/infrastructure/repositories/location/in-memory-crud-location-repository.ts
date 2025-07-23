import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationMongo } from '@/context/maps/infrastructure/schema/location.schema';
import { DriverMongo } from '@/context/maps/infrastructure/schema/driver.schema'; // AGREGADO
import { VehicleMongo } from '@/context/maps/infrastructure/schema/vehicle.schema'; // AGREGADO
import { LocationRepository } from '@/context/maps/domain/location/location.repository';
import { PrimitiveLocation } from '@/context/maps/domain/location/location.entity';

@Injectable()
export class InMemoryCrudLocationRepository extends LocationRepository {
  @InjectModel(LocationMongo.name)
  private locationModel: Model<LocationMongo>;

  @InjectModel(DriverMongo.name) // AGREGADO
  private driverModel: Model<DriverMongo>;

  @InjectModel(VehicleMongo.name) // AGREGADO
  private vehicleModel: Model<VehicleMongo>;

  constructor() {
    super();
  }

  async create(location: any): Promise<PrimitiveLocation> {
    try {
      console.log('1. Datos recibidos:', location);

      // ✅ AQUÍ ESTÁ EL FIX - Acceder a location.attributes
      const data = location.attributes || location; // Por si viene de ambas formas

      console.log('2. Datos extraídos:', data);

      // Crear objeto explícito con los datos correctos
      const locationData = {
        vehicleId: data.vehicleId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp || new Date(),
      };

      console.log('3. Objeto limpio:', locationData);

      const newLocation = new this.locationModel(locationData);
      console.log('4. Modelo creado:', newLocation);

      const saved = await newLocation.save();
      console.log('5. ¡GUARDADO EXITOSO!:', saved);

      return {
        id: saved._id.toString(),
        vehicleId: saved.vehicleId,
        latitude: saved.latitude,
        longitude: saved.longitude,
        timestamp: saved.timestamp,
      };
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('Error al crear la ubicación: ' + error.message);
    }
  }

  async update(location: PrimitiveLocation): Promise<PrimitiveLocation> {
    const id = location?.id;
    try {
      const updated = await this.locationModel.findByIdAndUpdate(
        id,
        { ...location, updatedAt: new Date() },
        { new: true },
      );
      if (!updated) {
        throw new Error('Ubicación no encontrada');
      }
      return {
        id: updated._id.toString(),
        vehicleId: updated.vehicleId,
        latitude: updated.latitude,
        longitude: updated.longitude,
        timestamp: updated.timestamp,
      };
    } catch (error) {
      throw new Error('Error al actualizar la ubicación: ' + error.message);
    }
  }

  async deleteLocation(id: string): Promise<any> {
    try {
      const deleted = await this.locationModel.findByIdAndDelete(id);
      if (!deleted) {
        return {
          message: 'Ubicación no encontrada',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }
      return {
        message: 'Ubicación eliminada correctamente',
        statusCode: HttpStatus.OK,
        data: { id: deleted._id.toString() },
      };
    } catch (error) {
      throw new Error('Error al eliminar la ubicación: ' + error.message);
    }
  }

  // MODIFICADO: getAll ahora recibe idUserAdmin y trae ubicaciones de sus drivers
  async getAll(idUserAdmin?: string): Promise<PrimitiveLocation[]> {
    try {
      // Si no se proporciona idUserAdmin, retornar todas las ubicaciones
      if (!idUserAdmin) {
        const locations = await this.locationModel.find().exec();
        return locations.map((loc) => ({
          id: loc._id.toString(),
          vehicleId: loc.vehicleId,
          latitude: loc.latitude,
          longitude: loc.longitude,
          timestamp: loc.timestamp,
        }));
      }

      // 1. Buscar drivers del admin
      const drivers = await this.driverModel.find({ idUserAdmin }).exec();

      if (drivers.length === 0) {
        return []; // No hay drivers para este admin
      }

      const allLocations: PrimitiveLocation[] = [];

      // 2. Para cada driver, buscar su vehículo y ubicaciones
      for (const driver of drivers) {
        // Buscar vehículo asignado al driver (usando driver._id)
        const vehicle = await this.vehicleModel
          .findOne({
            assignedDriver: driver._id.toString(),
          })
          .exec();

        if (vehicle) {
          // Buscar ubicaciones del vehículo
          const vehicleLocations = await this.locationModel
            .find({
              vehicleId: vehicle._id.toString(),
            })
            .exec();

          // Agregar ubicaciones al array
          const mappedLocations = vehicleLocations.map((loc) => ({
            id: loc._id.toString(),
            vehicleId: loc.vehicleId,
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp,
          }));

          allLocations.push(...mappedLocations);
        }
      }

      return allLocations;
    } catch (error) {
      throw new Error('Error al obtener las ubicaciones: ' + error.message);
    }
  }

  async getLocationById(id: string): Promise<PrimitiveLocation | null> {
    try {
      const loc = await this.locationModel.findById(id);
      if (!loc) return null;
      return {
        id: loc._id.toString(),
        vehicleId: loc.vehicleId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      };
    } catch (error) {
      throw new Error('Error al obtener la ubicación: ' + error.message);
    }
  }

  // AGREGADO: Método específico para obtener ubicaciones por vehicleId
  async getLocationsByVehicleId(vehicleId: string, limit = 100): Promise<PrimitiveLocation[]> {
    try {
      const locations = await this.locationModel
        .find({ vehicleId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();

      return locations.map((loc) => ({
        id: loc._id.toString(),
        vehicleId: loc.vehicleId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      }));
    } catch (error) {
      throw new Error('Error al obtener ubicaciones por vehículo: ' + error.message);
    }
  }
}
