export interface PrimitiveDriver {
  id?: string;
  name?: string;
  license?: string;
  assignedVehicle?: string;
}

export class Driver {
  constructor(private attributes: PrimitiveDriver) {}

  static create(createDriver: { name: string; license: string; assignedVehicle?: string }): Driver {
    return new Driver({
      name: createDriver.name,
      license: createDriver.license,
      assignedVehicle: createDriver.assignedVehicle,
    });
  }

  static update(updateDriver: {
    id?: string;
    name?: string;
    license?: string;
    assignedVehicle?: string;
  }): Driver {
    return new Driver({
      id: updateDriver.id,
      name: updateDriver.name,
      license: updateDriver.license,
      assignedVehicle: updateDriver.assignedVehicle,
    });
  }

  static delete(id: string): any {
    return new Driver({});
  }

  static getAll(): Driver[] {
    return [];
  }

  static async getDriverById(id: string): Promise<any> {
    return null;
  }

  toPrimitives(): PrimitiveDriver {
    return {
      id: this.attributes.id,
      name: this.attributes.name,
      license: this.attributes.license,
      assignedVehicle: this.attributes.assignedVehicle,
    };
  }
}
