import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerModule } from './employer/employer.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { PostgreSqlDataSource } from './config/OrmConfig';
import { WorkflowModule } from './workflow/workflow.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { configDotenv } from 'dotenv';

configDotenv();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      cache: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDISHOST,
      port: process.env.REDISPORT,
      ttl: 15,
      max: 10,
      auth_pass: process.env.REDISKEY , // Update the password here
      tls: { rejectUnauthorized: false }, // This is needed to connect to Azure Redis over SSL
    }),
    TypeOrmModule.forRoot(PostgreSqlDataSource),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    EmployerModule,
    CompanyModule,
    JobModule,
    ApplicationModule,
    WorkflowModule,
    UploadModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
