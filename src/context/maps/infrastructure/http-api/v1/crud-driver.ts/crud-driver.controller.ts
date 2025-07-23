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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DriverUseCases } from '@/context/maps/application/crud-driver-use-case/crud-driver.use-case'; // Ajustado a 'driver' para consistencia (de 'maps' a 'driver')
import {
  CreateDriverDto,
  UpdateDriverDto,
} from '@/context/maps/infrastructure/http-api/v1/crud-driver.ts/crud-driver.http-dto'; // Ajustado path para DTOs
import { errorResponse } from '@/context/shared/response/ErrorsResponse';
import { AuthGuard } from '@/context/shared/guards/auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // Agregado para documentación Swagger

@ApiTags('drivers') // Tag para Swagger, alineado con la prueba técnica
@Controller('v1/drivers')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Validación automática de DTOs en todos los endpoints
@ApiBearerAuth('access-token') // Requiere token JWT para endpoints protegidos
export class DriverController {
  constructor(private readonly driverService: DriverUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo conductor (driver)' })
  @ApiResponse({ status: 201, description: 'Conductor creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async create(@Request() req, @Body() createDriverDto: CreateDriverDto) {
    // Validación manual: Solo admins pueden crear drivers

    await errorResponse(createDriverDto, CreateDriverDto); // Validación adicional de DTO si es necesario

    try {
      // Enlazar al admin autenticado (req.user.sub) como idUserAdmin
      const driverWithUser = {
        ...createDriverDto,
        idUserAdmin: req.user.sub, // Enlaza al admin que crea el driver
      };

      return await this.driverService.saveDriver(driverWithUser); // Usamos saveDriver del UseCase actualizado
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al crear el driver. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los conductores' })
  @ApiResponse({ status: 200, description: 'Conductores recuperados exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async findAll(@Request() req): Promise<any> {
    try {
      // Filtrar drivers por el admin autenticado (usando getDriversByAdmin del UseCase)
      return await this.driverService.getDriversByAdmin(req.user.sub);
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al obtener los drivers. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un conductor por ID' })
  @ApiResponse({ status: 200, description: 'Conductor actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async update(@Request() req, @Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    // Chequeo adicional: Verificar si el admin es el asociado al driver
    const driver = await this.driverService.getDriverById(id);
    if (driver.data && driver.data.idUserAdmin !== req.user.sub) {
      throw new BadRequestException('No tienes permiso para actualizar este driver');
    }

    try {
      return await this.driverService.updateDriver({
        ...updateDriverDto,
        idUser: id, // Ajustado a idUser del entity
      });
    } catch (error) {
      throw new BadRequestException({
        errors: error.toString(),
        message: 'Hubo un error al actualizar el driver. Por favor, inténtalo nuevamente.',
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un conductor por ID' })
  @ApiResponse({ status: 200, description: 'Conductor eliminado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async delete(@Request() req, @Param('id') id: string) {
    // Chequeo adicional: Verificar si el admin es el asociado al driver
    const driver = await this.driverService.getDriverById(id);
    if (driver.data && driver.data.idUserAdmin !== req.user.sub) {
      throw new BadRequestException('No tienes permiso para eliminar este driver');
    }

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
