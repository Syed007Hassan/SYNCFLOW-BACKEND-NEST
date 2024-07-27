# SYNCFLOW BACKEND

### Overview

Traditionally, key processes like candidate recruitment have been laboriously managed
manually, with many organizations still relying on spreadsheets for applicant tracking. Despite
the prevalence of software solutions streamlining day-to-day activities, there's a significant gap
in automating the recruitment process. This project stems from the critical need to simplify
and structure the hiring process, addressing challenges for job seekers and employers alike. The primary objective is to develop a user-friendly interface that simplifies and streamlines
hiring procedures, utilizing AI-driven tools for job seekers to construct efficient profiles. Recruiters would now be able to map the whole hiring process flow and its stages beforehand
and they will be able to keep track of all the applicants within these stages. This will help them
take data-driven decisions, reduce biases, and increase the applicant's overall confidence in the hiring process. 

### Features
- Auth using Google OAuth for both Applicants and Recruiters
- Profile creation and management for companies
- Job creation and management for the hiring team
- Workflow creation (having customizable stages as needed) and management
- Email automation for each stage of the application
- Application tracking and analytics for Applicants 
- Feedback generation for Applicants in each stage

### Technology Stack
- NestJS
- PostgreSQL with TypeORM
- Redis
- Nodemailer
- AWS S3
- GitHub Actions for CICD
- Azure Web App for hosting
- Docker for dev environment

### To run the application
Running the APP using Docker Compose

- Create a **``` .env ```** file 

```
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CALLBACK_URL_RECRUITER=http://localhost:5000/api/auth/google/callback/recruiter

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

# AWS
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY=
AWS_S3_REGION=


# Email configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER= 
MAIL_PASS= 


# Azure PostgreSQL
PGHOST=
PGUSER=
PGPORT=
PGDATABASE=
PGPASSWORD=
PGSSLMODE=


#Azure Redis 
REDISHOST=
REDISPORT=
REDISKEY=

```
- When running locally, you can change some env variables in ``` app.module.ts ``` and ``` OrmConfig.ts ```
- Use `docker-compose build --no-cache` and then `docker-compose up` to start the app
- In case you want to deploy this app to Azure, you can change the Azure PostgreSQL and Redis env variables and CI CD will remain same 

