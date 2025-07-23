import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DriverMongo } from '@/context/maps/infrastructure/schema/driver.schema'; // Ajustado al esquema de driver
import { DriverRepository } from '@/context/maps/domain/driver.repository'; // Ajustado al abstracto
import { PrimitiveDriver } from '@/context/maps/domain/driver.entity'; // Primitives del entity
import { UserMongo } from '@/context/auth/infrastructure/schema/user.schema'; // Importar esquema de User para referencias (e.g., validar idUserAdmin)
import { NotificationMongo } from '@/context/maps/infrastructure/schema/notifier.schema'; // Asumiendo esquema para notificaciones
import { VehicleMongo } from '../schema/vehicle.schema';
@Injectable()
export class InMemoryCrudDriverRepository extends DriverRepository {
  @InjectModel(DriverMongo.name)
  private driverModel: Model<DriverMongo>;

  @InjectModel(UserMongo.name)
  private userModel: Model<UserMongo>;

  @InjectModel(NotificationMongo.name)
  private notificationModel: Model<NotificationMongo>;

  // AGREGADO: Inyectar modelo de Vehicle para obtener información completa
  @InjectModel('VehicleMongo') // Ajusta el nombre según tu esquema
  private vehicleModel: Model<VehicleMongo>; // Tipea correctamente según tu VehicleMongo

  constructor() {
    super();
  }

  async save(driver: PrimitiveDriver): Promise<PrimitiveDriver> {
    try {
      // Validar si idUserAdmin referencia a un user con rol 'admin'
      if (driver.idUserAdmin) {
        const admin = await this.userModel.findById(driver.idUserAdmin);
        console.log('Necesito ver el valor de esto: ', admin);

        if (!admin || admin.role !== 'admin') {
          throw new Error('idUserAdmin debe referenciar a un usuario con rol "admin"');
        }
      }

      const newDriver = new this.driverModel({
        ...driver,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedDriver = await newDriver.save();

      return {
        idUser: savedDriver._id.toString(),
        idUserAdmin: savedDriver.idUserAdmin,
        license: savedDriver.license,
        assignedVehicle: savedDriver.assignedVehicle,
      };
    } catch (error) {
      throw new Error('Error al guardar el conductor: ' + error.message);
    }
  }

  async getAll(): Promise<PrimitiveDriver[]> {
    try {
      const drivers = await this.driverModel.find().exec();

      // Filtrar conductores sin vehículo asignado (análogo a alertas predictivas en la prueba técnica)
      const driversWithoutVehicle = drivers.filter((driver) => !driver.assignedVehicle);

      // Guardar notificaciones para alertas (alineado con requisitos de alertas predictivas, integrando datos de users si es necesario)
      for (const driver of driversWithoutVehicle) {
        const existingNotification = await this.notificationModel.findOne({
          driverId: driver._id,
        });

        if (!existingNotification) {
          // Integrar datos de user: Obtener admin asociado para notificación (ej: enviar alerta al admin)
          const admin = await this.userModel.findById(driver.idUserAdmin);
          const adminEmail = admin ? admin.email : 'unknown';

          await new this.notificationModel({
            driverId: driver._id,
            status: 'Sin vehículo asignado',
            adminEmail, // Integración con datos de user (admin)
          }).save();
        }
      }

      return drivers.map((driver) => ({
        idUser: driver._id.toString(),
        idUserAdmin: driver.idUserAdmin,
        license: driver.license,
        assignedVehicle: driver.assignedVehicle,
      }));
    } catch (error) {
      throw new Error('Error al obtener los conductores: ' + error.message);
    }
  }

  async getById(id: string): Promise<PrimitiveDriver | null> {
    try {
      const driver = await this.driverModel.findById(id);

      if (!driver) {
        return null;
      }

      return {
        idUser: driver._id.toString(),
        idUserAdmin: driver.idUserAdmin,
        license: driver.license,
        assignedVehicle: driver.assignedVehicle,
      };
    } catch (error) {
      throw new Error('Error al obtener el conductor: ' + error.message);
    }
  }

  async update(id: string, driver: Partial<PrimitiveDriver>): Promise<PrimitiveDriver> {
    try {
      // Validar idUserAdmin si se actualiza (integrando chequeo con user data)
      if (driver.idUserAdmin) {
        const admin = await this.userModel.findById(driver.idUserAdmin);
        console.log('Necesito ver el valor de esto: ', admin);
        if (!admin || admin.role !== 'admin') {
          throw new Error('idUserAdmin debe referenciar a un usuario con rol "admin"');
        }
      }

      const updatedDriver = await this.driverModel.findByIdAndUpdate(
        id,
        {
          ...driver,
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!updatedDriver) {
        throw new Error('Conductor no encontrado');
      }

      return {
        idUser: updatedDriver._id.toString(),
        idUserAdmin: updatedDriver.idUserAdmin,
        license: updatedDriver.license,
        assignedVehicle: updatedDriver.assignedVehicle,
      };
    } catch (error) {
      throw new Error('Error al actualizar el conductor: ' + error.message);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedDriver = await this.driverModel.findByIdAndDelete(id);

      if (!deletedDriver) {
        return {
          message: 'Conductor no encontrado',
          statusCode: HttpStatus.NOT_FOUND,
          data: null,
        };
      }

      return {
        message: 'Conductor eliminado correctamente',
        statusCode: HttpStatus.OK,
        data: {
          id: deletedDriver._id.toString(),
        },
      };
    } catch (error) {
      throw new Error('Error al eliminar el conductor: ' + error.message);
    }
  }

  /* async getDriversByAdmin(adminId: string): Promise<PrimitiveDriver[]> {
    try {
      // Validar que adminId sea un admin válido (integración con user data)
      const admin = await this.userModel.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('adminId debe ser un usuario con rol "admin"');
      }

      const drivers = await this.driverModel.find({ idUserAdmin: adminId }).exec();

      return drivers.map((driver) => ({
        idUser: driver._id.toString(),
        idUserAdmin: driver.idUserAdmin,
        license: driver.license,
        assignedVehicle: driver.assignedVehicle,
      }));
    } catch (error) {
      throw new Error('Error al obtener drivers por admin: ' + error.message);
    }
  } */

  async getDriversByAdmin(adminId: string): Promise<any[]> {
    try {
      // Validar que adminId sea un admin válido (integración con user data)
      const admin = await this.userModel.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('adminId debe ser un usuario con rol "admin"');
      }

      const drivers = await this.driverModel.find({ idUserAdmin: adminId }).exec();
      console.log('Drivers encontrados:', drivers);

      // Obtener información completa para cada driver en un solo objeto
      const driversWithCompleteInfo = await Promise.all(
        drivers.map(async (driver) => {
          // 1. Obtener información del usuario asociado al driver
          const userInfo = await this.userModel.findById(driver.idUser).select('-password');

          // 2. CORREGIDO: Buscar vehículo usando driver._id (ObjectId) comparado con vehicle.assignedDriver
          let vehicleInfo = null;
          if (driver._id) {
            vehicleInfo = await this.vehicleModel
              .findOne({
                assignedDriver: driver._id.toString(), // Usar el _id del driver, no idUser
              })
              .exec();
          }

          console.log(`Driver ${driver._id} - Vehicle found:`, vehicleInfo ? 'YES' : 'NO');

          // 3. Cálculo predictivo de combustible (<1 hora autonomía - requisito de la prueba técnica)
          let fuelAlert = null;
          let fuelHoursRemaining = null;
          if (vehicleInfo && vehicleInfo.fuelLevel != null && !isNaN(vehicleInfo.fuelLevel)) {
            const fuelPercentage = vehicleInfo.fuelLevel;
            if (fuelPercentage < 15) {
              fuelHoursRemaining = (fuelPercentage / 15) * 1;
              fuelAlert = `Combustible crítico: ${fuelHoursRemaining.toFixed(1)} horas de autonomía restante`;
            }
          }

          // Retornar todo en un solo objeto plano con manejo de nulos
          return {
            // IDs corregidos (usando _id del driver como referencia principal)
            driverId: driver._id.toString(), // ID principal del driver
            idUser: driver.idUser || null,
            idUserAdmin: driver.idUserAdmin || null,
            vehicleId: vehicleInfo ? (vehicleInfo._id ? vehicleInfo._id.toString() : null) : null,

            // Información del conductor
            license: driver.license || null,
            assignedVehicle: vehicleInfo ? vehicleInfo._id.toString() : null,
            driverCreatedAt: driver.createdAt || null,
            driverUpdatedAt: driver.updatedAt || null,

            // Información del usuario (manejo seguro de nulos)
            userName: userInfo?.name || null,
            userEmail: userInfo?.email || null,
            userRole: userInfo?.role || null,

            // Información del vehículo (valores seguros para nulos)
            vehicleModel: vehicleInfo ? vehicleInfo.model || vehicleInfo.modelCar || null : null,
            vehiclePlate: vehicleInfo?.plate || null,
            vehicleFuelLevel: vehicleInfo?.fuelLevel != null ? vehicleInfo.fuelLevel : null,
            vehicleLatitude: vehicleInfo?.latitude != null ? vehicleInfo.latitude : null,
            vehicleLongitude: vehicleInfo?.longitude != null ? vehicleInfo.longitude : null,
            vehicleTemperature: vehicleInfo?.temperature != null ? vehicleInfo.temperature : null,
            vehicleSpeed: vehicleInfo?.speed != null ? vehicleInfo.speed : null,
            vehicleLastUpdate: vehicleInfo
              ? vehicleInfo.timestamp || vehicleInfo.updatedAt || null
              : null,

            // Estado y alertas predictivas (requisito de la prueba técnica)
            hasVehicleAssigned: !!vehicleInfo,
            status: !vehicleInfo ? 'Sin vehículo asignado' : 'Operativo',
            priority: !vehicleInfo ? 'HIGH' : fuelAlert ? 'CRITICAL' : 'NORMAL',
            fuelAlert: fuelAlert,
            fuelHoursRemaining: fuelHoursRemaining,
            fuelCritical: !!fuelAlert,
          };
        }),
      );

      console.log('Drivers with complete info:', driversWithCompleteInfo);
      return driversWithCompleteInfo;
    } catch (error) {
      throw new Error('Error al obtener drivers completos por admin: ' + error.message);
    }
  }
}
