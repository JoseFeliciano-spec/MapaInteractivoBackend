import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    description: 'El nombre del conductor',
    example: 'Juan Pérez',
    required: true,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name!: string;

  @ApiProperty({
    description: 'La licencia del conductor (formato alfanumérico con guiones)',
    example: 'ABC-123',
    required: true,
  })
  @IsNotEmpty({ message: 'La licencia es obligatoria' })
  @IsString({ message: 'La licencia debe ser una cadena de texto' })
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'La licencia debe ser alfanumérica con guiones (ej: ABC-123)',
  })
  license!: string;

  @ApiProperty({
    description: 'ID del vehículo asignado al conductor (opcional)',
    example: '605c72e1582d32001520b451',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del vehículo debe ser un BSON válido' })
  assignedVehicle?: string;
}

export class UpdateDriverDto {
  @ApiProperty({
    description: 'El ID del conductor que se desea actualizar',
    example: '605c72e1582d32001520b451',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del conductor es obligatorio' })
  @IsMongoId({ message: 'El ID debe ser un BSON válido' })
  id!: string;

  @ApiProperty({
    description: 'El nombre del conductor',
    example: 'Juan Pérez',
    required: true,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name!: string;

  @ApiProperty({
    description: 'La licencia del conductor (formato alfanumérico con guiones)',
    example: 'ABC-123',
    required: true,
  })
  @IsNotEmpty({ message: 'La licencia es obligatoria' })
  @IsString({ message: 'La licencia debe ser una cadena de texto' })
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'La licencia debe ser alfanumérica con guiones (ej: ABC-123)',
  })
  license!: string;

  @ApiProperty({
    description: 'ID del vehículo asignado al conductor (opcional)',
    example: '605c72e1582d32001520b451',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del vehículo debe ser un BSON válido' })
  assignedVehicle?: string;
}

export class DeleteDriverDto {
  @ApiProperty({
    description: 'El ID del conductor que se desea eliminar',
    example: '605c72e1582d32001520b451',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del conductor es obligatorio' })
  @IsMongoId({ message: 'El ID debe ser un BSON válido' })
  id!: string;
}
