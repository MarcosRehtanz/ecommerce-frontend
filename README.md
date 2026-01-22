# E-commerce Frontend

Aplicación web para e-commerce B2C desarrollada con Next.js 14.

## Tech Stack

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TanStack Query** - Estado del servidor
- **TanStack Table** - Tablas con filtros y paginación
- **Zustand** - Estado local (auth, cart)
- **Mantine v7.6** - Componentes UI
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Formularios y validación

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000`

## Instalación

```bash
# Clonar repositorio
git clone git@github.com:MarcosRehtanz/ecommerce-frontend.git
cd ecommerce-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local si es necesario

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (port 3001) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter |

## Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas)
│   ├── (auth)/             # Grupo: Login, Register
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/             # Grupo: Tienda
│   │   ├── page.tsx        # Home
│   │   ├── products/       # Catálogo
│   │   ├── cart/           # Carrito
│   │   ├── checkout/       # Checkout
│   │   ├── orders/         # Historial de pedidos
│   │   └── profile/        # Perfil de usuario
│   └── admin/              # Panel de administración
│       ├── page.tsx        # Dashboard
│       ├── products/       # CRUD productos
│       ├── users/          # CRUD usuarios
│       └── orders/         # Gestión de pedidos
├── components/
│   ├── auth/               # AuthGuard
│   ├── layout/             # Header, Footer, MainLayout
│   └── providers/          # QueryClient, Mantine
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useReports.ts
├── lib/api/                # Clientes Axios
│   ├── axios.ts            # Instancia con interceptores
│   ├── auth.ts
│   ├── products.ts
│   ├── cart.ts
│   └── orders.ts
├── stores/                 # Zustand stores
│   ├── authStore.ts        # Sesión de usuario
│   └── cartStore.ts        # Carrito local
├── types/                  # TypeScript types
└── utils/                  # Utilidades
```

## Funcionalidades

### Usuario (Customer)
- Registro e inicio de sesión
- Navegar catálogo de productos
- Buscar y filtrar productos
- Agregar productos al carrito
- Realizar pedidos
- Ver historial de pedidos
- Editar perfil

### Administrador
- Dashboard con estadísticas y gráficos
- CRUD de productos con imágenes
- CRUD de usuarios
- Gestión de pedidos (cambiar estados)
- Reportes de ventas

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Home con productos destacados |
| `/products` | Catálogo completo |
| `/login` | Iniciar sesión |
| `/register` | Registrarse |

### Usuario Autenticado
| Ruta | Descripción |
|------|-------------|
| `/cart` | Carrito de compras |
| `/checkout` | Finalizar compra |
| `/orders` | Historial de pedidos |
| `/orders/:id` | Detalle de pedido |
| `/profile` | Editar perfil |

### Administrador
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard |
| `/admin/products` | Gestión de productos |
| `/admin/users` | Gestión de usuarios |
| `/admin/orders` | Gestión de pedidos |

## Estado de la Aplicación

### Server State (TanStack Query)
- Productos, usuarios, órdenes
- Cache automático
- Refetch en background
- Invalidación inteligente

### Client State (Zustand)
- `authStore` - Usuario, tokens, sesión
- `cartStore` - Carrito local (usuarios anónimos)

### Sincronización de Carrito
1. Usuario anónimo → carrito en localStorage (Zustand)
2. Usuario hace login → sync con servidor (estrategia MAX)
3. Usuario autenticado → carrito en servidor (TanStack Query)

## Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@example.com | Admin123! | ADMIN |
| user@example.com | User123! | USER |

## Capturas de Pantalla

### Catálogo de Productos
Página principal con grid de productos, búsqueda y filtros.

### Carrito
Drawer lateral con items, cantidades y total.

### Dashboard Admin
Estadísticas, gráficos de ventas, pedidos recientes.

### Gestión de Productos
Tabla con filtros, paginación, modal de creación/edición.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Licencia

MIT
