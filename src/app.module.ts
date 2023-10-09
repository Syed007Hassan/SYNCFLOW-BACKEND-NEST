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
      port: process.env.RD_PORT,
    }),
    TypeOrmModule.forRoot(PostgreSqlDataSource),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UserModule,
    EmployerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
