import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('company')
export class Job {
  @PrimaryGeneratedColumn()
  jobId: number;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  jobDescription: string;

  @Column({ nullable: true })
  jobType: string;

  @Column({ nullable: true })
  jobCategory: string;

  @Column({ nullable: true })
  jobCreatedAt: Date;
}
