import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Job } from '../job/entities/job.entity';
import { Applicant } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Job, Applicant])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
