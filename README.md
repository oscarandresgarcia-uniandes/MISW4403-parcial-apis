# Parcial Práctico - Diseño y construcción de APIs

[https://github.com/oscarandresgarcia-uniandes/MISW4403-parcial-apis](https://github.com/oscarandresgarcia-uniandes/MISW4403-parcial-apis)

API RESTful para la gestión de gestión de restaurantes.

## Requisitos

- Node.js 16 o superior
- Docker y Docker Compose (opcional)

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

## Ejecutar PostgreSQL sin Docker (opcional)

Con tu instancia de base de datos PostgreSQL corriendo, crea una base de datos llamada `gestion_restaurantes`. Debes tener en cuenta que la app tratar;a de escuchar ehn el puereto 5433 según la configuración de tu .env. y `app.module.ts` el puereto a 5432 que es el puerto por defecto si no vas a usar Docker. Esto se hizo así por si tienes otra base de datos corriendo ene el puerto opor defecto, no entre en conflcito con el puerto 5432

## Ejecutar PostgreSQL con Docker (recomendado)

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
4. La aplicación se ejecutará en el puerto http://localhost:4100/api/v1/ 

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
    - `restaurant/` - Módulo de restaurantes
    - `restaurant-dish/` - Módulo de relación entre restaurantes y platos
    - `dish/` - Módulo de platos
    - `shared/` - Utilidades compartidas

## Módulos Disponibles

- **Restaurant**: Gestión de restaurantes
- **Dish**: Gestión de restaurantes
- **Restaurant-Dish**: Asociación de REstaurante con Plato

## Endpoints API

La API proporciona los siguientes endpoints para cada entidad:

### Operaciones Básicas (disponibles para todas las entidades)

- `GET /[entidad]`: Lista todos los elementos
- `GET /[entidad]/:id`: Obtiene un elemento por ID
- `POST /[entidad]`: Crea un nuevo elemento
- `PUT /[entidad]/:id`: Actualiza un elemento existente
- `DELETE /[entidad]/:id`: Elimina un elemento por ID

### Endpoints Específicos

- **Restaurants**: `/restaurants`
- **Dishes**: `/dishes`

### Relaciones entre Entidades

- **Restaurants-Dishes**: `/restaurants/:restaurantId/dishes`