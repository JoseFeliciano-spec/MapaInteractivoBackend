import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@/context/auth/domain/user.repository';
import { Model } from 'mongoose';
import { User } from '@/context/auth/domain/user.entity';
import { UserMongo } from '@/context/auth/infrastructure/schema/user.schema';
import { DriverMongo } from '@/context/maps/infrastructure/schema/driver.schema'; // AGREGADO
import { VehicleMongo } from '@/context/maps/infrastructure/schema/vehicle.schema'; // AGREGADO
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InMemoryUserRepository extends UserRepository {
  @InjectModel(UserMongo.name) private userModel: Model<UserMongo>;
  @InjectModel(DriverMongo.name) private driverModel: Model<DriverMongo>; // AGREGADO
  @InjectModel(VehicleMongo.name) private vehicleModel: Model<VehicleMongo>; // AGREGADO

  constructor(private jwtService: JwtService) {
    super();
  }

  async getUserFromToken(token: string): Promise<any> {
    try {
      // Find the user using the decoded sub (user id)
      const user: any = await this.userModel.findOne({ _id: token });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // NUEVO: Si es driver, obtener vehicleId
      let vehicleId = null;
      if (user.role === 'driver') {
        vehicleId = await this.getVehicleIdForDriver(user._id.toString());
      }

      return {
        message: 'Usuario encontrado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: user._id.toString(),
          name: user.name,
          role: user.role,
          email: user.email,
          vehicleId: vehicleId, // AGREGADO
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async save(user: User): Promise<any> {
    const userUsing = user.toPrimitives();
    const existingUser = await this.userModel.findOne({
      email: userUsing.email,
    });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(userUsing.password, 10);

    const newUser = new this.userModel({
      ...userUsing,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await newUser.save();

    const payload = { sub: savedUser._id, email: savedUser.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Se ha creado el usuario correctamente',
      statusCode: HttpStatus.ACCEPTED,
      data: {
        access_token: token,
        role: savedUser.role,
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }

  async login({ email, password }: { email: string; password: string }): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválida: El email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    await this.userModel.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // NUEVO: Obtener vehicleId para drivers
    let vehicleId = null;
    if (user.role === 'driver') {
      vehicleId = await this.getVehicleIdForDriver(user._id.toString());
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      message: 'Se ha iniciado sesión correctamente',
      statusCode: HttpStatus.OK,
      data: {
        access_token: await this.jwtService.signAsync(payload),
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
        vehicleId: vehicleId, // AGREGADO - Campo principal
      },
    };
  }

  // NUEVO MÉTODO: Obtener vehicleId usando _id del Driver (CORREGIDO)
  private async getVehicleIdForDriver(userId: string): Promise<string | null> {
    try {
      // 1. Buscar driver por idUser (que es el _id del user)
      const driver = await this.driverModel.findOne({ idUser: userId });

      if (!driver) {
        console.log(`No se encontró driver para userId: ${userId}`);
        return null;
      }

      // 2. CORREGIDO: Buscar vehicle usando _id del driver (NO idUser)
      const vehicle = await this.vehicleModel.findOne({
        assignedDriver: driver._id.toString(), // ✅ Usar _id del Driver
      });

      if (!vehicle) {
        console.log(`No se encontró vehículo para driver._id: ${driver._id}`);
        return null;
      }

      console.log(`Vehículo encontrado: ${vehicle._id} para driver: ${driver._id}`);
      return vehicle._id.toString();
    } catch (error) {
      console.error('Error obteniendo vehicleId para driver:', error);
      return null;
    }
  }
}
