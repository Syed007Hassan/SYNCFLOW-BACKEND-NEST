import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostgreSqlDataSource } from './config/ormConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerModule } from './employer/employer.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis',
      port: 6379,
      ttl: 15,
      max: 10,
    }),
    TypeOrmModule.forRoot(PostgreSqlDataSource),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    EmployerModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
