import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AppliedJob } from './entities/appliedJob.entity';
import { Assessment } from './entities/assessment.entity';
import { HiredApplicant } from './entities/hiredApplicant.entity';
import { Interview } from './entities/interview.entity';
import { Company } from 'src/company/entities/company.entity';
import { Recruiter } from 'src/employer/entities/employer.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Recruiter,
      Job,
      AppliedJob,
      Assessment,
      HiredApplicant,
      Interview,
    ]),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
