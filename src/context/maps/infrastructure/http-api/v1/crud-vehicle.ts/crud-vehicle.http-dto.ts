import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Toyota Hilux 2023',
    required: true,
  })
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  modelCar!: string;

  @ApiProperty({
    description: 'Placa del vehículo (debe ser única)',
    example: 'ABC-123',
    required: true,
  })
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  plate!: string;

  @ApiProperty({
    description: 'Nivel de combustible actual (porcentaje, 0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'El nivel de combustible es obligatorio' })
  @IsNumber({}, { message: 'El nivel de combustible debe ser un número' })
  @Min(0, { message: 'El nivel de combustible no puede ser menor a 0' })
  @Max(100, { message: 'El nivel de combustible no puede ser mayor a 100' })
  fuelLevel!: number;

  @ApiProperty({
    description: 'ID del conductor asignado (opcional)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del conductor debe ser un MongoDB válido' })
  assignedDriver?: string;

  @ApiProperty({
    description: 'Latitud GPS actual (opcional)',
    example: 19.432608,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  latitude?: number;

  @ApiProperty({
    description: 'Longitud GPS actual (opcional)',
    example: -99.133209,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  longitude?: number;

  @ApiProperty({
    description: 'Timestamp de la última actualización GPS (opcional)',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  timestamp?: Date;
}

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'ID del vehículo a actualizar',
    example: '507f1f77bcf86cd799439013',
    required: true,
  })
  @IsMongoId({ message: 'El ID del vehículo debe ser un MongoDB válido' })
  @IsNotEmpty({ message: 'El ID del vehículo es obligatorio' })
  id!: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Toyota Hilux 2023',
    required: true,
  })
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  model!: string;

  @ApiProperty({
    description: 'Placa del vehículo (debe ser única)',
    example: 'ABC-123',
    required: true,
  })
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  plate!: string;

  @ApiProperty({
    description: 'Nivel de combustible actual (porcentaje, 0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'El nivel de combustible es obligatorio' })
  @IsNumber({}, { message: 'El nivel de combustible debe ser un número' })
  @Min(0, { message: 'El nivel de combustible no puede ser menor a 0' })
  @Max(100, { message: 'El nivel de combustible no puede ser mayor a 100' })
  fuelLevel!: number;

  @ApiProperty({
    description: 'ID del conductor asignado (opcional)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del conductor debe ser un MongoDB válido' })
  assignedDriver?: string;

  @ApiProperty({
    description: 'Latitud GPS actual (opcional)',
    example: 19.432608,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  latitude?: number;

  @ApiProperty({
    description: 'Longitud GPS actual (opcional)',
    example: -99.133209,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  longitude?: number;

  @ApiProperty({
    description: 'Timestamp de la última actualización GPS (opcional)',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  timestamp?: Date;
}

export class DeleteVehicleDto {
  @ApiProperty({
    description: 'ID del vehículo a eliminar',
    example: '507f1f77bcf86cd799439013',
    required: true,
  })
  @IsMongoId({ message: 'El ID del vehículo debe ser un MongoDB válido' })
  @IsNotEmpty({ message: 'El ID del vehículo es obligatorio' })
  id!: string;
}
