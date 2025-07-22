// Interfaz para los datos primitivos de un vehículo con ubicación integrada
export interface PrimitiveVehicle {
  id?: string;
  model?: string;
  plate?: string; // Placa del vehículo
  fuelLevel?: number; // Nivel de combustible actual
  assignedDriver?: string; // ID del conductor asignado
  latitude?: number; // Ubicación GPS: latitud
  longitude?: number; // Ubicación GPS: longitud
  timestamp?: Date; // Timestamp de la última actualización de ubicación
}

export class Vehicle {
  constructor(private attributes: PrimitiveVehicle) {}

  static create(createVehicle: {
    model: string;
    plate: string;
    fuelLevel: number;
    assignedDriver?: string;
    latitude?: number;
    longitude?: number;
    timestamp?: Date;
  }): Vehicle {
    return new Vehicle({
      model: createVehicle.model,
      plate: createVehicle.plate,
      fuelLevel: createVehicle.fuelLevel,
      assignedDriver: createVehicle.assignedDriver,
      latitude: createVehicle.latitude,
      longitude: createVehicle.longitude,
      timestamp: createVehicle.timestamp || new Date(),
    });
  }

  static update(updateVehicle: {
    id?: string;
    model?: string;
    plate?: string;
    fuelLevel?: number;
    assignedDriver?: string;
    latitude?: number;
    longitude?: number;
    timestamp?: Date;
  }): Vehicle {
    return new Vehicle({
      id: updateVehicle.id,
      model: updateVehicle.model,
      plate: updateVehicle.plate,
      fuelLevel: updateVehicle.fuelLevel,
      assignedDriver: updateVehicle.assignedDriver,
      latitude: updateVehicle.latitude,
      longitude: updateVehicle.longitude,
      timestamp: updateVehicle.timestamp,
    });
  }

  static delete(id: string): any {
    return new Vehicle({});
  }

  static getAll(): Vehicle[] {
    return [];
  }

  static async getVehicleById(id: string): Promise<any> {
    return null;
  }

  toPrimitives(): PrimitiveVehicle {
    return {
      id: this.attributes.id,
      model: this.attributes.model,
      plate: this.attributes.plate,
      fuelLevel: this.attributes.fuelLevel,
      assignedDriver: this.attributes.assignedDriver,
      latitude: this.attributes.latitude,
      longitude: this.attributes.longitude,
      timestamp: this.attributes.timestamp,
    };
  }
}
