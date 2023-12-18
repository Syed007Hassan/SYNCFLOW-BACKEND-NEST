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

@Entity('stageAssignee')
export class StageAssignee {
  @Index()
  @PrimaryGeneratedColumn()
  stageAssigneeId: number;

  @Column({ nullable: true })
  assigneeName: string;

  @Column({ nullable: true })
  recruiterId: number;

  @ManyToOne(() => Stage, (stage) => stage.assignees)
  @JoinColumn({ name: 'stageId' })
  stage: Stage;
}
