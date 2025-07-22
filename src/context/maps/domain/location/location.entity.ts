// Interfaz para los datos primitivos de una ubicación GPS
export interface PrimitiveLocation {
  id?: string;
  vehicleId?: string;
  latitude?: number;
  longitude?: number;
  timestamp?: Date;
}

export class Location {
  constructor(private attributes: PrimitiveLocation) {}

  static create(createLocation: {
    vehicleId: string;
    latitude: number;
    longitude: number;
    timestamp?: Date;
  }): Location {
    return new Location({
      vehicleId: createLocation.vehicleId,
      latitude: createLocation.latitude,
      longitude: createLocation.longitude,
      timestamp: createLocation.timestamp || new Date(),
    });
  }

  static update(updateLocation: {
    id?: string;
    vehicleId?: string;
    latitude?: number;
    longitude?: number;
    timestamp?: Date;
  }): Location {
    return new Location({
      id: updateLocation.id,
      vehicleId: updateLocation.vehicleId,
      latitude: updateLocation.latitude,
      longitude: updateLocation.longitude,
      timestamp: updateLocation.timestamp,
    });
  }

  static delete(id: string): any {
    return new Location({ vehicleId: id });
  }

  static getAll(): Location[] {
    return [];
  }

  static async getLocationById(id: string): Promise<any> {
    return null;
  }

  toPrimitives(): PrimitiveLocation {
    return {
      id: this.attributes.id,
      vehicleId: this.attributes.vehicleId,
      latitude: this.attributes.latitude,
      longitude: this.attributes.longitude,
      timestamp: this.attributes.timestamp,
    };
  }
}
