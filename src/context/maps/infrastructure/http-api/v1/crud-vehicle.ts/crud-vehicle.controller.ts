import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  UseGuards,
  Request,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { VehicleUseCases } from '@/context/maps/application/crud-vehicle-use-case/crud-vehicle.use-case';
import { CreateVehicleDto } from '@/context/maps/infrastructure/http-api/v1/crud-vehicle.ts/crud-vehicle.http-dto';
import { errorResponse } from '@/context/shared/response/ErrorsResponse';
import { AuthGuard } from '@/context/shared/guards/auth.guard';

@Controller('v1/vehicles')
@UseGuards(AuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleUseCases) {}

  @Post()
  async register(@Request() req, @Body() vehicleDto: CreateVehicleDto) {
    await errorResponse(vehicleDto, CreateVehicleDto);
    try {
      const vehicleWithUser = {
        ...vehicleDto,
      };
      return await this.vehicleService.registerVehicle(vehicleWithUser as any);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Error al registrar el vehículo.',
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.vehicleService.getAllVehicles();
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Error al obtener los vehículos.',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.vehicleService.getVehicleById(id);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Error al obtener el vehículo.',
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() vehicleDto: CreateVehicleDto) {
    await errorResponse(vehicleDto, CreateVehicleDto);
    try {
      return await this.vehicleService.updateVehicle({
        ...vehicleDto,
        id,
      });
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Error al actualizar el vehículo.',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.vehicleService.deleteVehicle(id);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Error al eliminar el vehículo.',
      });
    }
  }
}
