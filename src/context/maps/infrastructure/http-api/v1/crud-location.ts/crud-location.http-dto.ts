import { IsNotEmpty, IsNumber, Min, Max, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrudLocationDto {
  @ApiProperty({
    description: 'ID de la ubicación (opcional para creación)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID debe ser un MongoDB válido' })
  id?: string;

  @ApiProperty({
    description: 'ID del vehículo asociado',
    example: '507f1f77bcf86cd799439012',
    required: true,
  })
  @IsNotEmpty({ message: 'El vehicleId es obligatorio' })
  @IsMongoId({ message: 'El vehicleId debe ser un MongoDB válido' })
  vehicleId: string;

  @ApiProperty({
    description: 'Latitud GPS',
    example: 19.432608,
    required: true,
  })
  @IsNotEmpty({ message: 'La latitud es obligatoria' })
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  latitude: number;

  @ApiProperty({
    description: 'Longitud GPS',
    example: -99.133209,
    required: true,
  })
  @IsNotEmpty({ message: 'La longitud es obligatoria' })
  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  longitude: number;

  @ApiProperty({
    description: 'Timestamp de la ubicación (opcional, default: now)',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  timestamp?: Date;
}
