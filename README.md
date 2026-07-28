# Restaurant Management

Full-stack restaurant management application for handling products, dining
room tables, and the complete lifecycle of an order.

## Features

### Dashboard

- Summary of products, tables, active orders, and daily revenue.
- Current table availability.
- Recent orders with direct access to their details.
- Monetary values displayed in Argentine pesos (`ARS`).

### Products

- Create, edit, list, and delete products.
- Display product availability.
- Validation for name, description, and price.
- Protection against deleting products referenced by existing orders.

### Tables and dining room

- Create, edit, enable, disable, and delete tables.
- Validation of unique table numbers and table capacity.
- Interactive dining room layout.
- Drag tables from a dedicated movement handle and persist their positions.
- Contextual actions from each table:
  - Create an order when the table is available.
  - Manage the active order.
  - Edit, enable, disable, or delete the table.
- Table cards available in a collapsible secondary list.

### Orders

- Create an order directly from an available table.
- Display and manage the active order associated with a table.
- Paginated order list.
- Add, update, and remove order items.
- Add notes of up to 250 characters to individual order items.
- Keep the same product as separate items when their notes differ.
- Track the total number of units and the order total.
- Order lifecycle from pending to preparing, ready, and delivered.
- Cancellation of active orders before delivery.

- Status-dependent actions and editing restrictions.

## Technical specifications

### Backend

- .NET 10 and ASP.NET Core Web API.
- Entity Framework Core 10.
- SQLite database.
- MediatR for commands and queries.
- FluentValidation for request validation.
- Swagger/OpenAPI.
- Global API error handling with Problem Details responses.
- Automatic database migration on application startup.
- xUnit, NSubstitute, and Coverlet for unit tests and coverage.

The backend follows a layered architecture:

```text
Restaurant.Api
    -> Restaurant.Application
        -> Restaurant.Domain
    -> Restaurant.Infrastructure
        -> Restaurant.Application
        -> Restaurant.Domain
```

- `Restaurant.Domain`: entities, business rules, enums, and repository
  abstractions.
- `Restaurant.Application`: commands, queries, handlers, validation, mappings,
  and response models.
- `Restaurant.Infrastructure`: Entity Framework Core, SQLite persistence,
  repositories, and migrations.
- `Restaurant.Api`: HTTP controllers, dependency injection, middleware, CORS,
  Swagger, and application startup.

### Frontend

- Angular 21 with standalone components.
- TypeScript 5.9.
- Signals and computed signals for local state.
- Reactive Forms.
- RxJS.
- Tailwind CSS 4.
- Angular Material/CDK.
- Heroicons through `@ng-icons`.
- Vitest with V8 coverage.
- Lazy-loaded feature routes.

The frontend is organized by feature:

```text
frontend/src/app
|-- core/          # Shell, header, sidebar, and application layout
|-- features/
|   |-- dashboard/
|   |-- orders/
|   |-- products/
|   `-- tables/
`-- shared/        # Reusable components, domain models, icons, and utilities
```

### Containers

- Multi-stage backend image based on the .NET SDK and ASP.NET runtime.
- Multi-stage frontend image based on Node.js and Nginx.
- Nginx serves the Angular application and proxies `/api` to the backend.
- SQLite data is stored in a named Docker volume.

## Run with Docker

### Requirements

- Docker Desktop, or Docker Engine with Docker Compose.

From the repository root:

```bash
docker compose up --build
```

Open:

- Application: [http://localhost:4200](http://localhost:4200)
- API through the frontend proxy:
  `http://localhost:4200/api`

The backend applies pending Entity Framework migrations automatically. The
SQLite database is stored in the `restaurant-data` volume and survives
container recreation.

Run the containers in the background:

```bash
docker compose up -d --build
```

Check their status and logs:

```bash
docker compose ps
docker compose logs -f
```

Stop the application without deleting data:

```bash
docker compose down
```

Stop the application and permanently remove the database volume:

```bash
docker compose down --volumes
```

> `docker compose down --volumes` deletes all persisted application data.

## Run locally

### Requirements

- .NET 10 SDK.
- Node.js 24 or a compatible current Node.js release.
- npm.

### 1. Start the backend

From the repository root:

```bash
cd backend
dotnet restore Restaurant.slnx
dotnet run --project Restaurant.Api/Restaurant.Api.csproj --launch-profile https
```

The local API is available at:

- HTTPS: `https://localhost:7105`
- HTTP: `http://localhost:5014`
- Swagger: [https://localhost:7105/swagger](https://localhost:7105/swagger)

If the local HTTPS certificate is not trusted:

```bash
dotnet dev-certs https --trust
```

The local SQLite database is created as
`backend/Restaurant.Api/restaurant.db`, and pending migrations are applied
when the API starts.

### 2. Start the frontend

In another terminal, from the repository root:

```bash
cd frontend
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

The development frontend connects to
`https://localhost:7105/api`. Therefore, the HTTPS backend profile must be
running and its development certificate must be accepted by the browser.

## Tests

### Backend

From `backend`:

```bash
dotnet test Restaurant.slnx
```

Run a specific test project:

```bash
dotnet test Restaurant.Domain.Tests/Restaurant.Domain.Tests.csproj
dotnet test Restaurant.Application.Tests/Restaurant.Application.Tests.csproj
```

Collect backend coverage:

```bash
dotnet test Restaurant.slnx --collect:"XPlat Code Coverage"
```

### Frontend

From `frontend`:

```bash
npx ng test --watch=false
```

Run tests for a specific feature:

```bash
npx ng test --watch=false --include src/app/features/orders
npx ng test --watch=false --include src/app/features/products
npx ng test --watch=false --include src/app/features/tables
npx ng test --watch=false --include src/app/shared/components
```

Generate a V8 coverage report:

```bash
npx ng test --watch=false --coverage --coverage-reporters text --coverage-reporters html
```

The HTML report is generated under `frontend/coverage`.

## Database migrations

Create a new migration from `backend`:

```bash
dotnet ef migrations add MigrationName --project Restaurant.Infrastructure/Restaurant.Infrastructure.csproj --startup-project Restaurant.Api/Restaurant.Api.csproj --context AppDbContext --output-dir Migrations
```

Apply migrations manually when needed:

```bash
dotnet ef database update --project Restaurant.Infrastructure/Restaurant.Infrastructure.csproj --startup-project Restaurant.Api/Restaurant.Api.csproj --context AppDbContext
```

Normal application startup already applies pending migrations, so the manual
update command is mainly useful for development and troubleshooting.

## Repository structure

```text
Restaurant/
|-- backend/
|   |-- Restaurant.Api/
|   |-- Restaurant.Application/
|   |-- Restaurant.Application.Tests/
|   |-- Restaurant.Domain/
|   |-- Restaurant.Domain.Tests/
|   `-- Restaurant.Infrastructure/
|-- frontend/
|-- compose.yaml
`-- README.md
```
