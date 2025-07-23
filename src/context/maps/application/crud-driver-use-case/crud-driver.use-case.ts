import { Injectable } from '@nestjs/common';
import { Driver, PrimitiveDriver } from '@/context/maps/domain/driver.entity'; // Ajusta path según tu estructura
import { DriverRepository } from '@/context/maps/domain/driver.repository'; // Ajusta path según tu estructura
import { CrudDriverDto } from './crud-driver.dto'; // DTO para Driver, ajusta path

@Injectable()
export class DriverUseCases {
  constructor(private readonly driverRepository: DriverRepository) {}

  async saveDriver(
    dto: CrudDriverDto,
  ): Promise<{ data: PrimitiveDriver; message: string; statusCode: number }> {
    const driver = Driver.create(dto as any); // Usa create del entity para validación inicial
    const savedDriver = await this.driverRepository.save(driver.toPrimitives()); // Llama a save del repositorio

    return {
      data: savedDriver,
      message: 'Driver saved successfully',
      statusCode: 201,
    };
  }

  async getAllDrivers(): Promise<{
    data: PrimitiveDriver[];
    message: string;
    statusCode: number;
  }> {
    const drivers = await this.driverRepository.getAll();

    return {
      data: drivers,
      message: 'Drivers retrieved successfully',
      statusCode: 200,
    };
  }

  async getDriverById(
    id: string,
  ): Promise<{ data: PrimitiveDriver | null; message: string; statusCode: number }> {
    const driver = await this.driverRepository.getById(id);

    return {
      data: driver,
      message: driver ? 'Driver found' : 'Driver not found',
      statusCode: driver ? 200 : 404,
    };
  }

  async updateDriver(
    dto: CrudDriverDto,
  ): Promise<{ data: PrimitiveDriver; message: string; statusCode: number }> {
    const driver = Driver.update(dto as any); // Usa update del entity para validación
    const updatedDriver = await this.driverRepository.update(dto.idUser, driver.toPrimitives()); // Llama a update del repositorio con id y partial

    return {
      data: updatedDriver,
      message: 'Driver updated successfully',
      statusCode: 200,
    };
  }

  async deleteDriver(id: string): Promise<{ message: string; statusCode: number }> {
    await this.driverRepository.delete(id);

    return {
      message: 'Driver deleted successfully',
      statusCode: 200,
    };
  }

  async getDriversByAdmin(
    adminId: string,
  ): Promise<{ data: PrimitiveDriver[]; message: string; statusCode: number }> {
    const drivers = await this.driverRepository.getDriversByAdmin(adminId);

    return {
      data: drivers,
      message: 'Drivers by admin retrieved successfully',
      statusCode: 200,
    };
  }
}
