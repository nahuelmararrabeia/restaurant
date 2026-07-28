# Restaurant

## Run with Docker

Requirements:

- Docker Desktop or Docker Engine with Docker Compose.

From the repository root, run:

```bash
docker compose up --build
```

Open [http://localhost:4200](http://localhost:4200).

The SQLite database is stored in the `restaurant-data` Docker volume and
survives container recreation.

To stop the application:

```bash
docker compose down
```

To also remove the persisted database:

```bash
docker compose down --volumes
```
