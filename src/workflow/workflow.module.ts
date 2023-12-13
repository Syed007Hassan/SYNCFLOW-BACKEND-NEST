import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';
import { Job } from 'src/job/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkFlow, Job])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
