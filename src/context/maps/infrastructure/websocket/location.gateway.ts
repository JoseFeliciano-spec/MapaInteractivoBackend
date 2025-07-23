// Archivo: src/context/maps/infrastructure/websocket/location.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LocationUseCases } from '@/context/maps/application/crud-location-use-case/crud-location.use-case';
import * as crypto from 'crypto';

@WebSocketGateway({ cors: true, namespace: 'locations' })
@Injectable()
export class LocationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('LocationGateway');

  constructor(private readonly locationService: LocationUseCases) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized for locations');
    this.broadcastAllLocations();
    setInterval(() => this.broadcastAllLocations(), 10000);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('Token requerido');

      const payload = this.verifyJwtManual(token);
      client.data.user = payload;

      this.logger.log(`Usuario autenticado: ${payload.sub} - Rol: ${payload.role || 'N/A'}`);

      client.on('reconnect_attempt', () =>
        this.logger.log(`Reconexión intentada por ${client.id}`),
      );

      this.broadcastAllLocations();
    } catch (error) {
      this.logger.error(`Conexión fallida: ${error.message}`);
      client.disconnect();
      throw new UnauthorizedException('Token inválido');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendLocation')
  async handleSendLocation(
    client: Socket,
    data: { vehicleId: string; latitude: number; longitude: number },
  ) {
    try {
      this.logger.log(`Recibida ubicación de ${client.id}: ${JSON.stringify(data)}`);
      this.logger.log(`Usuario: ${client.data?.user?.sub} - Rol: ${client.data?.user?.role}`);

      if (client.data.user.role !== 'driver') {
        client.emit('error', { message: 'Solo drivers pueden enviar ubicaciones' });
        return;
      }

      // Validar datos
      if (!data.vehicleId || data.latitude == null || data.longitude == null) {
        throw new Error('vehicleId, latitude y longitude son requeridos');
      }

      this.logger.log(`Intentando crear ubicación para vehículo: ${data.vehicleId}`);

      console.log({
        vehicleId: data.vehicleId,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        timestamp: new Date(),
      });

      // DATOS LIMPIOS PARA EL REPOSITORIO
      const locationData = {
        vehicleId: data.vehicleId,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        timestamp: new Date(),
      };

      const newLocation = await this.locationService.createLocation(locationData);

      this.logger.log(`Ubicación creada exitosamente: ${JSON.stringify(newLocation)}`);

      // Broadcast
      this.server.emit('newLocation', newLocation.data);

      // Confirmar al cliente
      client.emit('locationSent', {
        message: 'Ubicación enviada exitosamente',
        data: newLocation.data,
      });
    } catch (error) {
      this.logger.error(`Error detallado en sendLocation: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      this.logger.error(`Datos recibidos: ${JSON.stringify(data)}`);

      client.emit('error', {
        message: 'Error al procesar la ubicación',
        details: error.message,
      });
    }
  }

  @SubscribeMessage('requestLocations')
  async handleRequestLocations(client: Socket) {
    // Cambiar validación de 'user' a 'admin' para ser consistente
    if (client.data.user.role !== 'admin') {
      client.emit('error', { message: 'Solo administradores pueden solicitar ubicaciones' });
      return;
    }
    await this.broadcastAllLocations(client);
  }

  // Archivo: src/context/maps/infrastructure/websocket/location.gateway.ts
  async broadcastAllLocations(client?: Socket) {
    try {
      if (!client) {
        // Si no hay cliente específico, no hacer broadcast general
        return;
      }

      // Verificar rol del usuario
      const userRole = client.data.user.role;
      const userId = client.data.user.sub;

      this.logger.log(`Solicitando ubicaciones para usuario: ${userId} con rol: ${userRole}`);

      let locations;

      if (userRole === 'admin') {
        // ADMIN: Obtener ubicaciones de todos sus drivers usando su ID como idUserAdmin
        locations = await this.locationService.getAllLocations(userId); // userId es el idUserAdmin
        this.logger.log(
          `Admin ${userId}: obtenidas ${locations.data.length} ubicaciones de sus drivers`,
        );
      } else {
        // Rol no autorizado
        client.emit('error', {
          message: 'Rol no autorizado para solicitar ubicaciones',
          allowedRoles: ['admin'],
        });
        return;
      }

      // Aplicar enmascaramiento de IDs según privacidad (requisito de la prueba técnica)
      const maskedLocations = locations.data.map((loc) => ({
        ...loc,
        id: this.maskId(loc.id, userRole),
        vehicleId: this.maskId(loc.vehicleId, userRole), // También enmascarar vehicleId
      }));

      // Enviar solo al cliente que solicitó (sesión específica)
      client.emit('allLocations', maskedLocations);

      this.logger.log(
        `Enviadas ${maskedLocations.length} ubicaciones filtradas para ${userRole}: ${userId}`,
      );
    } catch (error) {
      this.logger.error(`Error broadcasting locations: ${error.message}`);

      // Enviar error específico al cliente
      if (client) {
        client.emit('error', {
          message: 'Error al obtener ubicaciones',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    }
  }

  private verifyJwtManual(token: string): any {
    try {
      const [header, payload, signature] = token.split('.');
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error('JWT_SECRET no configurado');
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payload}`)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      if (signature !== expectedSignature) {
        throw new Error('Firma inválida');
      }

      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));

      if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
        throw new Error('Token expirado');
      }

      return decodedPayload;
    } catch (error) {
      this.logger.error(`Error en verificación JWT: ${error.message}`);
      throw error;
    }
  }

  private maskId(id: string, role: string): string {
    if (role === 'admin') return id;
    return `LOC-${id.substring(0, 4)}-****-${id.substring(id.length - 4)}`;
  }
}
