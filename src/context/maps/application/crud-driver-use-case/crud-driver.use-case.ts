import { Injectable } from '@nestjs/common';
import { Driver, PrimitiveDriver } from '@/context/maps/domain/driver.entity'; // Asumiendo path similar al de product
import { DriverRepository } from '@/context/maps/domain/driver.repository';
import { CrudDriverDto } from './crud-driver.dto'; // DTO análogo para Driver, a definir por separado

@Injectable()
export class DriverUseCases {
  constructor(private readonly driverRepository: DriverRepository) {}

  async createDriver(
    dto: CrudDriverDto,
  ): Promise<{ data: PrimitiveDriver; message: string; statusCode: number }> {
    const driver = Driver.create(dto as any);
    const savedDriver = await this.driverRepository.create(driver);

    return {
      data: savedDriver,
      message: 'Driver created successfully',
      statusCode: 201,
    };
  }

  async updateDriver(
    dto: CrudDriverDto,
  ): Promise<{ data: PrimitiveDriver; message: string; statusCode: number }> {
    const driver = Driver.update(dto as any);
    const updatedDriver = await this.driverRepository.update(driver);

    return {
      data: updatedDriver,
      message: 'Driver updated successfully',
      statusCode: 200,
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
    const driver = await this.driverRepository.getDriverById(id);

    return {
      data: driver,
      message: driver ? 'Driver found' : 'Driver not found',
      statusCode: driver ? 200 : 404,
    };
  }

  async deleteDriver(id: string): Promise<{ message: string; statusCode: number }> {
    await this.driverRepository.deleteDriver(id);

    return {
      message: 'Driver deleted successfully',
      statusCode: 200,
    };
  }
}
