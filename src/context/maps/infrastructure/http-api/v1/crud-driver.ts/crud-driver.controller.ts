import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DriverUseCases } from '@/context/maps/application/crud-driver-use-case/crud-driver.use-case';
import {
  CreateDriverDto,
  UpdateDriverDto,
} from '@/context/maps/infrastructure/http-api/v1/crud-driver.ts/crud-driver.http-dto';
import { errorResponse } from '@/context/shared/response/ErrorsResponse';
import { AuthGuard } from '@/context/shared/guards/auth.guard';

@Controller('v1/drivers')
@UseGuards(AuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverUseCases) {}

  @Post()
  async create(@Request() req, @Body() createDriverDto: CreateDriverDto) {
    await errorResponse(createDriverDto, CreateDriverDto);
    try {
      // Agregamos el userId desde el token para tracking
      const driverWithUser = {
        ...createDriverDto,
        createdBy: req.user.sub, // Guardamos quién creó el driver
      };

      return await this.driverService.createDriver(driverWithUser);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al crear el driver. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Get()
  async findAll(@Request() req): Promise<any> {
    try {
      return await this.driverService.getAllDrivers();
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al obtener los drivers. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    try {
      return await this.driverService.updateDriver({
        ...updateDriverDto,
        id: id,
      });
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al actualizar el driver. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    try {
      return await this.driverService.deleteDriver(id);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al eliminar el driver. Por favor, inténtalo nuevamente.',
      });
    }
  }
}
