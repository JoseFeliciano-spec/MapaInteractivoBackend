import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Importa el adaptador
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/context/auth/infrastructure/auth.module';
import { AuthGuard } from '@/context/shared/guards/auth.guard';
import { DriverModule } from '@/context/maps/infrastructure/driver.module';
import { VehicleModule } from '@/context/maps/infrastructure/modules/vehicle.module';
import { LocationModule } from '@/context/maps/infrastructure/modules/location.module';
@Module({
  providers: [
    AuthGuard,
    {
      provide: 'WS_ADAPTER',
      useClass: IoAdapter, // Configura Socket.io como driver
    },
  ],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    DriverModule,
    VehicleModule,
    LocationModule,
    MongooseModule.forRoot(
      `mongodb+srv://todo:${process.env.KEY_MONGO}@cluster0.i8kuny3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
  ],
})
export class AppModule {}
