import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Job } from '../job/entities/job.entity';
import { Applicant } from '../user/entities/user.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, Applicant, WorkFlow, Stage]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, EmailService],
})
export class ApplicationModule {}
