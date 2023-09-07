import { configDotenv } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

configDotenv();

export const PostgreSqlDataSource = TypeOrmModule.forRootAsync({
  name: 'postgres',
  useFactory: async (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: config.get('DB_PORT'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_NAME'),
    schema: config.get('DB_SCHEMA'),
    entities: [User],
    synchronize: true,
    logging: true,
  }),
  inject: [ConfigService],
});
