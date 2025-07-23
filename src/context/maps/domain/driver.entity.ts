export interface PrimitiveDriver {
  idUser?: string;
  idUserAdmin?: string;
  license?: string;
  assignedVehicle?: string;
}

export class Driver {
  constructor(private attributes: PrimitiveDriver) {}

  static create(createDriver: {
    idUser: string;
    license: string;
    idUserAdmin?: string;
    assignedVehicle?: string;
  }): Driver {
    return new Driver({
      idUserAdmin: createDriver.idUserAdmin,
      idUser: createDriver.idUser,
      license: createDriver.license,
      assignedVehicle: createDriver.assignedVehicle,
    });
  }

  static update(updateDriver: {
    idUser?: string;
    license?: string;
    idUserAdmin?: string;
    assignedVehicle?: string;
  }): Driver {
    return new Driver({
      idUser: updateDriver.idUser,
      idUserAdmin: updateDriver?.idUserAdmin,
      license: updateDriver.license,
      assignedVehicle: updateDriver.assignedVehicle,
    });
  }

  static delete(idUser: string): any {
    return new Driver({});
  }

  static getAll(): Driver[] {
    return [];
  }

  static async getDriverByidUser(idUser: string): Promise<any> {
    return null;
  }

  toPrimitives(): PrimitiveDriver {
    return {
      idUser: this.attributes.idUser,
      idUserAdmin: this.attributes.idUserAdmin,
      license: this.attributes.license,
      assignedVehicle: this.attributes.assignedVehicle,
    };
  }
}
