import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(configService.get('PG_PORT')),
  username: configService.get('PG_USER'),
  password: 'fast',
  database: configService.get('PG_DB'),
  schema: configService.get('DB_SCHEMA'),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: true,
  logging: true,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
