### To run the application

- Create a **``` .env ```** file 

```
MONGODB_URI=
JWT_SECRET=secret
jwt_secret=secretjwt4565
PORT=5000

# Docker environment variables
DB_TYPE=postgres
PG_HOST=postgres
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=postgres
PG_PORT=5432
RD_PORT=6379
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
PGADMIN_DEFAULT_EMAIL=admin@pgadmin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

2- `docker-compose build --no-cache`

3- `docker-compose up`

### To run migrations (must checkout to branch-migrations)
- `docker-compose exec nestapp npm run migration:generate --name=Employee`

### Pushing Images to DockerHub

#### Step 1: Tag the Docker image
`docker tag nestjs syed007hassan/nestjs`

#### Step 2: Log in to Docker Hub
`docker login --username=syed007hassan`

#### Step 3: Push the Docker image to Docker Hub
`docker push syed007hassan/nestjs`
