import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { WorkFlow } from './entities/workflow.entity';
import { AppliedJob } from './entities/appliedJob.entity';
import { Assessment } from './entities/assessment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Job, WorkFlow, AppliedJob, Assessment])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
