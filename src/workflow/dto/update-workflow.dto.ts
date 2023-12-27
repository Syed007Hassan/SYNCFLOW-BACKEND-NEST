import { PartialType } from '@nestjs/swagger';
import { CreateWorkFlowDto } from './create-workflow.dto';

export class UpdateWorkflowDto extends PartialType(CreateWorkFlowDto) {}
