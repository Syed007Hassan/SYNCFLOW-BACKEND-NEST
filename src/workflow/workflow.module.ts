import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlow } from './entities/workflow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkFlow])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
