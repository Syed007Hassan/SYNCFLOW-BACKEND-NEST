import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './entities/employer.entity';
import { CompanyModule } from 'src/company/company.module';
import { HttpModule } from '@nestjs/axios';
import { Company } from 'src/company/entities/company.entity';
import { Job } from 'src/job/entities/job.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';
import { StageAssignee } from 'src/workflow/entities/stageAssignee';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recruiter,
      Company,
      Job,
      WorkFlow,
      Stage,
      StageAssignee,
    ]),
    CompanyModule,
    HttpModule,
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
