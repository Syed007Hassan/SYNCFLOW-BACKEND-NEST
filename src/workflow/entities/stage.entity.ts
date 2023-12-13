import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { StageAssignee } from './stageAssignee';
import { WorkFlow } from './workflow.entity';

@Entity('stage')
export class Stage {
  @PrimaryGeneratedColumn()
  stageId: number;

  @Column()
  stageName: string;

  @Column()
  category: string;

  @ManyToOne(() => WorkFlow, (workflow) => workflow.stages)
  @JoinColumn({ name: 'workflowId' })
  workflow: WorkFlow;

  @OneToMany(() => StageAssignee, (stageAssignee) => stageAssignee.stage)
  assignees: StageAssignee[];
}
