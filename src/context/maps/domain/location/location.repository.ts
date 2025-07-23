import { PrimitiveLocation } from './location.entity';

export abstract class LocationRepository {
  abstract create(location: PrimitiveLocation): Promise<PrimitiveLocation>;
  abstract update(location: Partial<PrimitiveLocation>): Promise<PrimitiveLocation>;
  abstract deleteLocation(id: string): Promise<void>;
  abstract getAll(id?: string | null): Promise<PrimitiveLocation[]>;
  abstract getLocationById(id: string): Promise<PrimitiveLocation | null>;
}
