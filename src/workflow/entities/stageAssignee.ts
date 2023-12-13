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

  @ManyToMany(() => Stage, (stage) => stage.assignees)
  stages: Stage[];
}
