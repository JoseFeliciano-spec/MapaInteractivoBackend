import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    description: 'El ID del conductor que se desea actualizar (idUser)',
    example: '605c72e1582d32001520b451',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del conductor es obligatorio' })
  @IsMongoId({ message: 'El ID debe ser un BSON válido' })
  idUser!: string;

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
    example: '605c72e1582d32001520b452',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del vehículo debe ser un BSON válido' })
  assignedVehicle?: string;
}

export class UpdateDriverDto {
  @ApiProperty({
    description: 'El ID del conductor que se desea actualizar (idUser)',
    example: '605c72e1582d32001520b451',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del conductor es obligatorio' })
  @IsMongoId({ message: 'El ID debe ser un BSON válido' })
  idUser!: string;

  @ApiProperty({
    description:
      'La licencia del conductor (formato alfanumérico con guiones, opcional para actualización)',
    example: 'ABC-123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La licencia debe ser una cadena de texto' })
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'La licencia debe ser alfanumérica con guiones (ej: ABC-123)',
  })
  license?: string;

  @ApiProperty({
    description: 'ID del vehículo asignado al conductor (opcional)',
    example: '605c72e1582d32001520b452',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'El ID del vehículo debe ser un BSON válido' })
  assignedVehicle?: string;
}

export class DeleteDriverDto {
  @ApiProperty({
    description: 'El ID del conductor que se desea eliminar (idUser)',
    example: '605c72e1582d32001520b451',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del conductor es obligatorio' })
  @IsMongoId({ message: 'El ID debe ser un BSON válido' })
  idUser!: string;
}
