import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';
import { Job } from 'src/job/entities/job.entity';
import { StageAssignee } from './entities/stageAssignee';
import { Stage } from './entities/stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkFlow, Job, Stage, StageAssignee])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
