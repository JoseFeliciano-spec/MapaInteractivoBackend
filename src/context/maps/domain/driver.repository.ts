import { PrimitiveDriver, Driver } from '@/context/maps/domain/driver.entity';

// Interfaz para el repositorio de driver
export abstract class DriverRepository {
  // Métodos abstractos que deben implementarse en la clase concreta (e.g., MongoDriverRepository)
  abstract create(driver: Driver): Promise<PrimitiveDriver>;
  abstract deleteDriver(id: string): Promise<void>;
  abstract getAll(): Promise<PrimitiveDriver[]>;
  abstract update(driver: Driver): Promise<PrimitiveDriver>;
  abstract getDriverById(id: string): Promise<PrimitiveDriver | null>;
}
