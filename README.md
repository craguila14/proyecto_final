# Peluditos Shop E-commerce

## Descripción
Peluditos E-commerce es una aplicación web fullstack para una tienda en línea de productos para mascotas. Permite a los usuarios ver productos, agregarlos al carrito, gestionar sus propios productos y realizar compras.

La URL del sitio en produccion es : https://peluditos.shortenqr.com/

![alt text](<Screenshot 2024-09-15 at 19.00.11.png>)

## Características principales
- Catálogo de productos para perros y gatos
- Carrito de compras
- Sistema de autenticación de usuarios
- Gestión de productos para vendedores
- Lista de favoritos
- Detalles de producto
- API RESTful en el backend

## Tecnologías utilizadas
### Frontend
- React.js
- Context API para manejo de estado
- Axios para peticiones HTTP
- React Router para navegación
- Bootstrap para estilos

### Backend
- Node.js
- Express.js
- PostgreSQL para la base de datos
- JWT para autenticación

## Instalación
1. Clona el repositorio:
   ```
   git clone https://github.com/fcolabbe/proyecto_final
   ```
2. Instala las dependencias del frontend:
   ```
   cd frontend
   npm install
   ```
3. Instala las dependencias del backend:
   ```
   cd ../backend
   npm install
   ```
4. Configura las variables de entorno en el backend (crea un archivo .env)

   DB_USER= 
   DB_PASSWORD=
   DB_HOST=
   DB_PORT=
   DB_DATABASE=
   JWT_SECRET=

5. Inicia el servidor de desarrollo del frontend:
   ```
   cd ../frontend
   npm start
   ```
6. Inicia el servidor de backend:
   ```
   cd ../backend
   npm run dev
   ```

## Estructura del proyecto
### Frontend
- `src/views`: Componentes principales de las vistas
- `src/contexts`: Contextos de React para manejo de estado global
- `src/config`: Configuraciones y constantes

### Backend
- `routes`: Definición de rutas de la API
- `controllers`: Lógica de negocio
- `models`: Modelos de Sequelize
- `middlewares`: Middlewares personalizados

## Componentes principales del Frontend
- `Productos.jsx`: Muestra el catálogo de productos
- `DetalleProducto.jsx`: Muestra los detalles de un producto específico
- `Carrito.jsx`: Gestiona el carrito de compras
- `MisProductos.jsx`: Permite a los vendedores gestionar sus productos

## Rutas principales del Backend
- `GET /api/productos`: Obtiene todos los productos
- `GET /api/productos/:id`: Obtiene un producto específico
- `POST /api/productos`: Registra un nuevo producto
- `PUT /api/productos/:id`: Actualiza un producto existente
- `DELETE /api/productos/:id`: Elimina un producto

## Autenticación
El sistema utiliza JWT para la autenticación. Los tokens se almacenan en cookies en el frontend y se envían en el encabezado de autorización para las solicitudes autenticadas.

## Contribución
Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de crear un pull request.

© 2024 Página creada por Constanza Águila, Loreto Villouta y Francisco Labbé
