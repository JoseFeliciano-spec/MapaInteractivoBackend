// Actualización del repositorio abstracto para Driver, alineado con el estilo del UserRepository (con save en lugar de create, y métodos como getDriverFromToken)
import { PrimitiveDriver } from './driver.entity'; // Ajusta al path de tu entity

export abstract class DriverRepository {
  abstract save(driver: PrimitiveDriver): Promise<PrimitiveDriver>; // Similar a save para crear/actualizar
  abstract getAll(): Promise<PrimitiveDriver[]>; // Obtener todos los drivers
  abstract getById(id: string): Promise<PrimitiveDriver | null>; // Obtener por ID
  abstract update(id: string, driver: Partial<PrimitiveDriver>): Promise<PrimitiveDriver>; // Actualizar
  abstract delete(id: string): Promise<void>; // Eliminar
  abstract getDriversByAdmin(adminId: string): Promise<PrimitiveDriver[]>; // Específico para drivers por admin (usando idUserAdmin)
}
