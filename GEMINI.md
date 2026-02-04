# Project Overview

This is an e-commerce B2C web application frontend, developed using **Next.js 14** with the App Router. It serves as the user interface for an online store, providing functionalities for both customers and administrators.

## Tech Stack

The project utilizes a modern tech stack:

*   **Next.js 14**: React framework with App Router for server-side rendering and routing.
*   **TypeScript**: For static typing and improved code quality.
*   **TanStack Query**: Manages server state, including data fetching, caching, and synchronization.
*   **TanStack Table**: Used for building interactive tables with filtering and pagination, particularly in the admin panel.
*   **Zustand**: A fast and scalable bear-necessities state-management solution for local client-side state (e.g., authentication, shopping cart).
*   **Mantine v7.6**: A comprehensive React components library for building responsive and accessible user interfaces.
*   **Axios**: A promise-based HTTP client for making API requests.
*   **React Hook Form + Zod**: For form management and schema-based validation.

## Architecture and Key Features

The application is structured into distinct areas for authentication, general shopping, and administration.

### Customer Features

*   User registration and login.
*   Browsing product catalog, including search and filtering.
*   Adding products to the shopping cart.
*   Placing orders and viewing order history.
*   Managing user profile.

### Administrator Features

*   Dashboard with statistics and graphs.
*   CRUD (Create, Read, Update, Delete) operations for products (including images), users, and orders.
*   Sales reports.

### State Management

*   **Server State**: Managed by TanStack Query for dynamic data like products, users, and orders, offering automatic caching and background refetching.
*   **Client State**: Managed by Zustand for local state such as user session (`authStore`) and anonymous shopping cart (`cartStore`).

### Cart Synchronization

The application implements a robust cart synchronization mechanism:
1.  Anonymous users store their cart in `localStorage` via Zustand.
2.  Upon user login, the local cart is synchronized with the server cart using a "MAX" strategy (merging quantities).
3.  Authenticated users' carts are managed server-side via TanStack Query.

## Building and Running

### Requirements

*   Node.js 18+
*   A backend server running at `http://localhost:3000` (The `NEXT_PUBLIC_API_URL` environment variable should point to the backend API).

### Installation

```bash
# Clone the repository
git clone git@github.com:MarcosRehtanz/ecommerce-frontend.git
cd ecommerce-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local if necessary, ensuring NEXT_PUBLIC_API_URL is correctly set.
```

### Available Scripts

*   `npm run dev`: Starts the development server (typically on port 3001).
*   `npm run build`: Creates a production build of the application.
*   `npm run start`: Starts the production server using the built application.
*   `npm run lint`: Runs the linter to check for code style and potential errors.

## Development Conventions

### Project Structure (src/)

*   `app/`: Contains all Next.js App Router pages and layouts, organized by feature groups (`(auth)`, `(shop)`, `admin`).
    *   `app/(auth)/`: Login and registration pages.
    *   `app/(shop)/`: Home, product catalog, cart, checkout, orders, and user profile.
    *   `app/admin/`: Admin dashboard, product management, user management, and order management.
*   `components/`: Reusable React components, categorized by functionality (e.g., `auth`, `layout`, `home`, `providers`, `ui`).
*   `hooks/`: Custom React hooks for encapsulating reusable logic (e.g., `useAuth`, `useProducts`, `useCart`).
*   `lib/api/`: Axios client instances and API service modules for interacting with the backend.
*   `stores/`: Zustand stores for managing global client-side state (`authStore`, `cartStore`).
*   `types/`: TypeScript type definitions.
*   `utils/`: Utility functions.

## Test Users

For testing purposes, the following credentials can be used:

| Email               | Password   | Role    |
| :------------------ | :--------- | :------ |
| `admin@example.com` | `Admin123!`| `ADMIN` |
| `user@example.com`  | `User123!` | `USER`  |

## License

MIT License
