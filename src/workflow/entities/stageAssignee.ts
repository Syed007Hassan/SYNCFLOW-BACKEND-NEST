import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { Stage } from './stage.entity';
import { Assignees } from '../dto/assignees.interface';

@Entity('stageAssignee')
export class StageAssignee {
  @Index()
  @PrimaryGeneratedColumn()
  stageAssigneeId: number;

  @ManyToOne(() => Stage, (stage) => stage.assignees)
  @JoinColumn({ name: 'stageId' })
  stage: Stage;

  @Column({ type: 'jsonb', nullable: true })
  assignees: Assignees[];
}
