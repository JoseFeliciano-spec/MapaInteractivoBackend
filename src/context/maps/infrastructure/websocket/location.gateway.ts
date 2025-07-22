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
import * as crypto from 'crypto'; // Nativo de Node.js, sin librerías externas

@WebSocketGateway({ cors: true, namespace: 'locations' })
@Injectable()
export class LocationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('LocationGateway');

  constructor(private readonly locationService: LocationUseCases) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized for locations');
    this.broadcastAllLocations();
    setInterval(() => this.broadcastAllLocations(), 10000); // Broadcast periódico
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('Token requerido');

      const payload = this.verifyJwtManual(token); // Validación manual
      client.data.user = payload;

      // Reconexión automática (configurada en cliente, pero log aquí)
      client.on('reconnect_attempt', () =>
        this.logger.log(`Reconexión intentada por ${client.id}`),
      );

      this.broadcastAllLocations(); // Inicial
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
    if (client.data.user.role !== 'driver') {
      client.emit('error', { message: 'Solo drivers pueden enviar ubicaciones' });
      return;
    }

    try {
      const newLocation = await this.locationService.createLocation({
        vehicleId: data.vehicleId,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      // Cheque predictivo simple (ej: alerta si timestamp indica desactualización >1h)
      const now = new Date();
      const isOutdated = now.getTime() - new Date(newLocation.data.timestamp).getTime() > 3600000; // 1 hora
      if (isOutdated) {
        this.server.emit('alert', {
          message: `Alerta: Ubicación desactualizada para vehículo ${data.vehicleId}`,
        });
      }

      // Broadcast con enmascarado de ID para no-admins
      const broadcastData = {
        ...newLocation.data,
        id: this.maskId(newLocation.data.id, client.data.user.role),
      };
      this.server.emit('newLocation', broadcastData);
      this.logger.log(`Nueva ubicación enviada por driver ${client.data.user.id}`);
    } catch (error) {
      client.emit('error', { message: 'Error al procesar la ubicación' });
      this.logger.error(`Error en sendLocation: ${error.message}`);
    }
  }

  @SubscribeMessage('requestLocations')
  async handleRequestLocations(client: Socket) {
    if (client.data.user.role !== 'user') {
      client.emit('error', { message: 'Acceso denegado' });
      return;
    }
    await this.broadcastAllLocations(client); // Broadcast selectivo al cliente
  }

  async broadcastAllLocations(client?: Socket) {
    try {
      const locations = await this.locationService.getAllLocations();
      const role = client ? client.data.user.role : 'user'; // Default a 'user' para broadcasts generales

      // Enmascarar IDs basado en rol
      const maskedLocations = locations.data.map((loc) => ({
        ...loc,
        id: this.maskId(loc.id, role),
      }));

      if (client) {
        client.emit('allLocations', maskedLocations); // Selectivo
      } else {
        this.server.emit('allLocations', maskedLocations); // A todos
      }
      this.logger.log('Broadcasted all locations');
    } catch (error) {
      this.logger.error(`Error broadcasting: ${error.message}`);
    }
  }

  // Implementación manual de verificación JWT (HS256, sin librerías externas)
  private verifyJwtManual(token: string): any {
    const [header, payload, signature] = token.split('.');
    const secret = process.env.JWT_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // URL-safe

    if (signature !== expectedSignature) {
      throw new Error('Firma inválida');
    }

    // Decodificar payload (base64 a JSON)
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    // Validar expiración manual (exp en segundos desde epoch)
    if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
      throw new Error('Token expirado');
    }

    return decodedPayload;
  }

  // Enmascarar ID para privacidad (ej: LOC-****-XC54 para no-admins)
  private maskId(id: string, role: string): string {
    if (role === 'admin') return id; // Admins ven ID completo
    return `LOC-${id.substring(0, 4)}-****-${id.substring(id.length - 4)}`; // Enmascarado
  }
}
