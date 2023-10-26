### To run the application

1- Add .env

```
MONGODB_URI=
JWT_SECRET=secret
jwt_secret=secretjwt4565
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
PORT=5000
```

2- ```docker-compose build --no-cache```

3- ```docker-compose up```


### To run migrations (must checkout to branch-migrations)

1- ```docker-compose exec nestapp npm run migration:generate --name=Employee```
  

