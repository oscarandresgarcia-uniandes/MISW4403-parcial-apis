# Parcial Práctico - Diseño y construcción de APIs

API RESTful para la gestión de gestión de restaurantes.

## Requisitos

- Node.js 16 o superior
- Docker y Docker Compose

## Configuración del Entorno

1. Clonar el repositorio:
   ```
   git clone <url-del-repositorio>
   cd <carpeta del proyecto>
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Configurar variables de entorno: crear un archivo `.env` basado en `.env.example` y modificar según sea necesario.

## Ejecutar PostgreSQL con Docker

Para iniciar la base de datos PostgreSQL utilizando Docker Compose:

```bash
docker-compose up
```

Esto iniciará:

- PostgreSQL en el puerto 5433
- Nombre de la base de datos: gestion_restaurantes
- Usuario: postgres
- Contraseña: postgres

## Ejecutar en Desarrollo

1. Asegurarse de tener PostgreSQL en ejecución
2. Configurar las variables de entorno en `.env`
3. Ejecutar la aplicación en modo desarrollo:
   ```
   npm run start:dev
   ```

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm run test
```

Para las pruebas e2e:

```bash
npm run test:e2e
```

## Estructura del Proyecto

- `src/` - Código fuente
    - `restaurante/` - Módulo de restaurantes
    - `restaurante-plato/` - Módulo de relación entre restaurantes y platos
    - `plato/` - Módulo de platos
    - `shared/` - Utilidades compartidas

## Módulos Disponibles

- **Restaurante**: Gestión de restaurantes
- **Plato**: Gestión de restaurantes
- **CRestaurante-Plato**: Asociación de REstaurante con Plato

## Endpoints API

La API proporciona los siguientes endpoints para cada entidad:

### Operaciones Básicas (disponibles para todas las entidades)

- `GET /[entidad]`: Lista todos los elementos
- `GET /[entidad]/:id`: Obtiene un elemento por ID
- `POST /[entidad]`: Crea un nuevo elemento
- `PUT /[entidad]/:id`: Actualiza un elemento existente
- `DELETE /[entidad]/:id`: Elimina un elemento por ID

### Endpoints Específicos

- **Restaurantes**: `/restaurantes`
- **Platos**: `/platos`

### Relaciones entre Entidades

- **Restaurantes-Platos**: `/restaurantes/:restauranteId/platos`