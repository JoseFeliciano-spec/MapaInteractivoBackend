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
import { LocationUseCases } from '@/context/maps/application/crud-location-use-case/crud-location.use-case';
import { CrudLocationDto } from './crud-location.http-dto';
import { errorResponse } from '@/context/shared/response/ErrorsResponse';
import { AuthGuard } from '@/context/shared/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('v1/locations')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class LocationController {
  constructor(private readonly locationService: LocationUseCases) {}

  @Post()
  async create(@Request() req, @Body() dto: CrudLocationDto) {
    await errorResponse(dto, CrudLocationDto);
    try {
      return await this.locationService.createLocation(dto);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al crear la ubicación. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Get()
  async findAll(@Request() req): Promise<any> {
    try {
      return await this.locationService.getAllLocations();
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al obtener las ubicaciones. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: CrudLocationDto) {
    try {
      return await this.locationService.updateLocation({
        ...dto,
        id: id,
      });
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al actualizar la ubicación. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    try {
      return await this.locationService.deleteLocation(id);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al eliminar la ubicación. Por favor, inténtalo nuevamente.',
      });
    }
  }
}
