import { PrimitiveUser } from './user.entity'; // Asumiendo un entity con primitives para User/Driver

export abstract class UserDriverRepository {
  abstract create(user: PrimitiveUser): Promise<PrimitiveUser>;
  abstract getAll(): Promise<PrimitiveUser[]>;
  abstract getById(id: string): Promise<PrimitiveUser | null>;
  abstract update(id: string, user: Partial<PrimitiveUser>): Promise<PrimitiveUser>;
  abstract delete(id: string): Promise<void>;
  abstract getDriversByAdmin(adminId: string): Promise<PrimitiveUser[]>; // Método específico para obtener drivers por admin
}
