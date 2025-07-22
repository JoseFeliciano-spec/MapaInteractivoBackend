import { Injectable } from '@nestjs/common';
import { Vehicle, PrimitiveVehicle } from '@/context/maps/domain/vehicle/vehicle..entity'; // Ajusta el path según tu estructura
import { VehicleRepository } from '@/context/maps/domain/vehicle/vehicle.repository';
import { CrudVehicleDto } from '../crud-vehicle-use-case/crud-vehicle.dto'; // Asumiendo un DTO para Vehicle, similar al de Product

@Injectable()
export class VehicleUseCases {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async registerVehicle(dto: CrudVehicleDto): Promise<{
    data: PrimitiveVehicle;
    message: string;
    statusCode: number;
  }> {
    const vehicle = Vehicle.create(dto as any);
    const savedVehicle = await this.vehicleRepository.registerVehicle(vehicle);
    return {
      data: savedVehicle,
      message: 'Vehicle registered successfully',
      statusCode: 201,
    };
  }

  async getAllVehicles(): Promise<{
    data: PrimitiveVehicle[];
    message: string;
    statusCode: number;
  }> {
    const vehicles = await this.vehicleRepository.getAllVehicles();
    return {
      data: vehicles,
      message: 'Vehicles retrieved successfully',
      statusCode: 200,
    };
  }

  async getVehicleById(id: string): Promise<{
    data: PrimitiveVehicle | null;
    message: string;
    statusCode: number;
  }> {
    const vehicle = await this.vehicleRepository.getVehicleById(id);
    return {
      data: vehicle,
      message: vehicle ? 'Vehicle found' : 'Vehicle not found',
      statusCode: vehicle ? 200 : 404,
    };
  }

  async updateVehicle(dto: CrudVehicleDto): Promise<{
    data: PrimitiveVehicle | null;
    message: string;
    statusCode: number;
  }> {
    const vehicle = Vehicle.update(dto as any);
    const updatedVehicle = await this.vehicleRepository.updateVehicle(vehicle);
    return {
      data: updatedVehicle,
      message: 'Vehicle updated successfully',
      statusCode: 200,
    };
  }

  async deleteVehicle(id: string): Promise<{
    message: string;
    statusCode: number;
  }> {
    await this.vehicleRepository.deleteVehicle(id);
    return {
      message: 'Vehicle deleted successfully',
      statusCode: 200,
    };
  }
}
