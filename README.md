## Project setup

```bash
$ npm install
```

Create a .env file in the root directory and add:
```bash
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=concert_db
PORT=3000
```

Initial Database

```bash
docker compose up -d
```

Start Project
```bash
num run start:dev
```

## Run tests

```bash
# test coverage
$ npm run test:cov
```

## Architecture

Built with NestJS using a Clean Architecture approach.
domain/ – Core business entities and rules

use-cases/ – Application business logic

infrastructure/ – Database, external services implementation

presentation/ – Controllers (HTTP layer)


## Database Table

### concert
Stores concert information.

id – Unique identifier

name – Concert name

description – Concert details

totalSeats – Total available seats

createdAt – Creation timestamp

### reservation

Stores user reservations.

id – Unique identifier

concertId – Related concert

seatNumber – Reserved seat number

status – Reservation status (active/cancelled)

createdAt – Reservation timestamp

### history

Stores reservation activity logs.

id – Unique identifier

reservationId – Related reservation

action – Action type (reserve/cancel)

createdAt – Action timestamp


## Library

TypeORM – ORM for database interaction and entity management.

@nestjs/typeorm – Official NestJS integration for TypeORM.

MySQL2 – MySQL database driver used by TypeORM.

class-validator / class-transformer – Used for request validation and DTO transformation.

### Backend Optimization

- Database Indexing – Add indexes on frequently queried columns.
- Caching – Cache frequently accessed data like concert lists.
- Horizontal Scaling – Run multiple backend instances behind a load balancer.
- Asynchronous Processing / Queue / Event emiter – Use background jobs for non-critical tasks.
  
### How to handle many users reserving tickets at the same time?
- Add a UNIQUE constraint on (concertId, seatNumber)
- Use transactions when creating reservations to lock row.



