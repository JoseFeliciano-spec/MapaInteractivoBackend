import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationMongo } from '@/context/maps/infrastructure/schema/location.schema';
import { LocationRepository } from '@/context/maps/domain/location/location.repository';
import { PrimitiveLocation } from '@/context/maps/domain/location/location.entity';

@Injectable()
export class InMemoryCrudLocationRepository extends LocationRepository {
  constructor(
    @InjectModel(LocationMongo.name)
    private locationModel: Model<LocationMongo>,
  ) {
    super();
  }

  async create(location: PrimitiveLocation): Promise<PrimitiveLocation> {
    try {
      const newLocation = new this.locationModel({
        ...location,
        timestamp: location.timestamp || new Date(),
      });
      const saved = await newLocation.save();
      return {
        id: saved._id.toString(),
        vehicleId: saved.vehicleId,
        latitude: saved.latitude,
        longitude: saved.longitude,
        timestamp: saved.timestamp,
      };
    } catch (error) {
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

  async getAll(): Promise<PrimitiveLocation[]> {
    try {
      const locations = await this.locationModel.find().exec();
      return locations.map((loc) => ({
        id: loc._id.toString(),
        vehicleId: loc.vehicleId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      }));
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
}
