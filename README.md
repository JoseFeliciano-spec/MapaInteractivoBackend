# MapaInteractivoBackend - API para Mapa Interactivo

Este proyecto es una API REST robusta y escalable construida con **NestJS**, diseñada para gestionar la autenticación de usuarios y el CRUD (Crear, Leer, Actualizar, Eliminar) de conductores, vehículos y sus geolocalizaciones.  
La API está pensada para ser el backend de una aplicación de **mapa interactivo** para seguimiento de flotas o inventario móvil.

---

## ✨ Características Principales

- **Arquitectura Hexagonal**  
  El código está organizado siguiendo los principios de Puertos y Adaptadores, separando la lógica de negocio de los detalles de infraestructura para una mayor mantenibilidad y testeabilidad.

- **Autenticación Segura**  
  Implementación de autenticación basada en JSON Web Tokens (JWT) para proteger las rutas.

- **Documentación de API**  
  Uso de Swagger (OpenAPI) para generar documentación interactiva y facilitar las pruebas de los endpoints.

- **Comunicación en Tiempo Real**  
  Incluye un Gateway de WebSockets para la transmisión de datos de localización en tiempo real.

- **Base de Datos NoSQL**  
  Integrado con MongoDB para almacenar la información de manera flexible y eficiente.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** NestJS  
- **Lenguaje:** TypeScript  
- **Base de Datos:** MongoDB  
- **Autenticación:** JWT (JSON Web Tokens)  
- **Documentación:** Swagger  
- **WebSockets:** Para comunicación en tiempo real  

---

## 🚀 Puesta en Marcha Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- Node.js (v16 o superior)  
- npm o yarn  
- Una instancia de MongoDB en ejecución (local o en la nube)  

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/FeliInventoryBackend.git
cd FeliInventoryBackend
````

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# O con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (puedes usar `.env.example` como plantilla) y añade las siguientes variables:

```env
# Clave secreta para firmar los JSON Web Tokens
JWT_SECRET=tu_clave_secreta_super_segura

# Cadena de conexión a tu base de datos MongoDB
KEY_MONGO=key_mongo
```

### 4. Ejecutar la Aplicación

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

### 5. Documentación de la API

Una vez que la aplicación esté en ejecución, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api
```

---

## 📁 Estructura del Proyecto

El proyecto utiliza una arquitectura hexagonal para separar las responsabilidades y organizar el código de manera lógica y escalable.

```
src/
├── context/
│   ├── auth/                 # Contexto de Autenticación y Usuarios
│   │   ├── application/      # Casos de uso (lógica de aplicación)
│   │   ├── domain/           # Entidades y repositorios (lógica de negocio)
│   │   └── infrastructure/   # Implementaciones (controladores, DTOs, etc.)
│   │
│   ├── maps/                 # Contexto de Mapas (Conductores, Vehículos, Ubicaciones)
│   │   ├── application/
│   │   ├── domain/
│   │   └── infrastructure/
│   │
│   └── shared/               # Código compartido (guards, DTOs comunes, etc.)
│
├── app.module.ts             # Módulo raíz de la aplicación
└── main.ts                   # Punto de entrada de la aplicación
```

---

## 📜 Endpoints de la API (REST)

### Autenticación (`/v1/user`)

| Método | Ruta             | Descripción                               | Requiere Auth |
| ------ | ---------------- | ----------------------------------------- | ------------- |
| POST   | /register        | Registra un nuevo usuario                 | No            |
| POST   | /register-driver | Registra un nuevo usuario (rol conductor) | No            |
| POST   | /login           | Inicia sesión y devuelve un JWT           | No            |
| GET    | /me              | Obtiene los datos del usuario autenticado | Sí            |

**Ejemplo: POST /v1/user/register**

```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "password": "contraseñaSegura123"
}
```

---

### Conductores (`/v1/drivers`)

| Método | Ruta  | Descripción                      | Requiere Auth |
| ------ | ----- | -------------------------------- | ------------- |
| POST   | /     | Crea un nuevo conductor          | Sí            |
| GET    | /     | Obtiene todos los conductores    | Sí            |
| PUT    | /\:id | Actualiza un conductor por su ID | Sí            |
| DELETE | /\:id | Elimina un conductor por su ID   | Sí            |

**Ejemplo: POST /v1/drivers**

```json
{
  "idUser": "605c72e1582d32001520b451",
  "license": "ABC-123",
  "assignedVehicle": "605c72e1582d32001520b452"
}
```

---

### Vehículos (`/v1/vehicles`)

| Método | Ruta  | Descripción                     | Requiere Auth |
| ------ | ----- | ------------------------------- | ------------- |
| POST   | /     | Registra un nuevo vehículo      | Sí            |
| GET    | /     | Obtiene todos los vehículos     | Sí            |
| GET    | /\:id | Obtiene un vehículo por su ID   | Sí            |
| PUT    | /\:id | Actualiza un vehículo por su ID | Sí            |
| DELETE | /\:id | Elimina un vehículo por su ID   | Sí            |

**Ejemplo: POST /v1/vehicles**

```json
{
  "modelCar": "Toyota Hilux 2023",
  "plate": "ABC-123",
  "fuelLevel": 75,
  "assignedDriver": "507f1f77bcf86cd799439011",
  "latitude": 19.432608,
  "longitude": -99.133209,
  "timestamp": "2023-10-01T12:00:00Z"
}
```

---

### Ubicaciones (`/v1/locations`)

| Método | Ruta  | Descripción                         | Requiere Auth |
| ------ | ----- | ----------------------------------- | ------------- |
| POST   | /     | Crea un nuevo registro de ubicación | Sí            |
| GET    | /     | Obtiene todas las ubicaciones       | Sí            |
| PUT    | /\:id | Actualiza una ubicación por su ID   | Sí            |
| DELETE | /\:id | Elimina una ubicación por su ID     | Sí            |

**Ejemplo: POST /v1/locations**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "vehicleId": "507f1f77bcf86cd799439012",
  "latitude": 19.432608,
  "longitude": -99.133209,
  "timestamp": "2023-10-01T12:00:00Z"
}
```

---

## 📡 WebSockets (Tiempo Real)

La API utiliza WebSockets para la comunicación en tiempo real de las geolocalizaciones.
El gateway está configurado en el namespace `/locations`.

### Autenticación de Sockets

El cliente debe enviar un JWT válido en el handshake de conexión.

**Ejemplo de conexión en el cliente (JavaScript):**

```ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/locations', {
  auth: {
    token: 'tu_jwt_aqui' // JWT obtenido del endpoint /login
  }
});

socket.on('connect_error', (err) => {
  console.error(err.message); // ej. "Token inválido"
});
```

---

### Eventos del Servidor (Server → Client)

| Evento         | Descripción                                                               | Quién lo recibe        | Payload de Ejemplo                                                 |
| -------------- | ------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `newLocation`  | Notifica a todos los clientes sobre una nueva ubicación registrada        | Todos los clientes     | `{ "vehicleId": "...", "latitude": 19.43, ... }`                   |
| `allLocations` | Envía una lista de ubicaciones al cliente que las solicitó                | Solo el emisor         | `[{"id": "...", "vehicleId": "...", ...}]`                         |
| `locationSent` | Confirma al conductor que su ubicación fue recibida correctamente         | Solo el emisor         | `{ "message": "Ubicación enviada exitosamente", "data": { ... } }` |
| `error`        | Envía un mensaje de error cuando una operación falla o no está autorizada | Cliente que la originó | `{ "message": "Solo drivers pueden enviar ubicaciones" }`          |

---

### Eventos del Cliente (Client → Server)

| Evento             | Descripción                                         | Quién puede emitirlo    | Payload Requerido                                                  |
| ------------------ | --------------------------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| `sendLocation`     | Envía la geolocalización de un vehículo al servidor | Usuarios con rol driver | `{ "vehicleId": string, "latitude": number, "longitude": number }` |
| `requestLocations` | Solicita listado completo de ubicaciones            | Usuarios con rol admin  | (ninguno)                                                          |

```

---
```
