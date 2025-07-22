import { Vehicle } from './vehicle..entity';

export abstract class VehicleRepository {
  abstract registerVehicle(vehicle: Vehicle): Promise<any>;

  abstract getAllVehicles(): Promise<any>;

  abstract getVehicleById(id: string): Promise<any>;

  abstract updateVehicle(vehicle: Vehicle): Promise<any>;

  abstract deleteVehicle(id: string): Promise<any>;
}
