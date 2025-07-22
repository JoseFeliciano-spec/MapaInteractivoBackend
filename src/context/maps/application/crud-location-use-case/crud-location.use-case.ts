import { Injectable } from '@nestjs/common';
import { Location, PrimitiveLocation } from '@/context/maps/domain/location/location.entity'; // Asumiendo path similar al de driver
import { LocationRepository } from '@/context/maps/domain/location/location.repository';
import { CrudLocationDto } from './crud-location.dto'; // DTO análogo para Location, a definir por separado

@Injectable()
export class LocationUseCases {
  constructor(private readonly locationRepository: LocationRepository) {}

  async createLocation(
    dto: CrudLocationDto,
  ): Promise<{ data: PrimitiveLocation; message: string; statusCode: number }> {
    const location = Location.create(dto as any);
    const savedLocation = await this.locationRepository.create(location as any);

    return {
      data: savedLocation,
      message: 'Location created successfully',
      statusCode: 201,
    };
  }

  async updateLocation(
    dto: CrudLocationDto,
  ): Promise<{ data: PrimitiveLocation; message: string; statusCode: number }> {
    const location = Location.update(dto as any);
    const updatedLocation = await this.locationRepository.update(location as any);

    return {
      data: updatedLocation,
      message: 'Location updated successfully',
      statusCode: 200,
    };
  }

  async getAllLocations(): Promise<{
    data: PrimitiveLocation[];
    message: string;
    statusCode: number;
  }> {
    const locations = await this.locationRepository.getAll();

    return {
      data: locations,
      message: 'Locations retrieved successfully',
      statusCode: 200,
    };
  }

  async getLocationById(
    id: string,
  ): Promise<{ data: PrimitiveLocation | null; message: string; statusCode: number }> {
    const location = await this.locationRepository.getLocationById(id);

    return {
      data: location,
      message: location ? 'Location found' : 'Location not found',
      statusCode: location ? 200 : 404,
    };
  }

  async deleteLocation(id: string): Promise<{ message: string; statusCode: number }> {
    await this.locationRepository.deleteLocation(id);

    return {
      message: 'Location deleted successfully',
      statusCode: 200,
    };
  }
}
