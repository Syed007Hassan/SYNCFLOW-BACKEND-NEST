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
import { Application } from 'src/application/entities/application.entity';

@Entity('stage')
export class Stage {
  @PrimaryGeneratedColumn()
  stageId: number;

  @Column()
  stageName: string;

  @Column()
  category: string;

  @ManyToOne(() => WorkFlow, (workflow) => workflow.stages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflowId' })
  workflow: WorkFlow;

  @OneToMany(() => StageAssignee, (stageAssignee) => stageAssignee.stage)
  assignees: StageAssignee[];

  @OneToMany(() => Application, (application) => application.stage)
  applications: Application[];
}
