import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Applicant } from './user.entity';

@Entity('applicantDetails')
export class ApplicantDetails {
  @PrimaryGeneratedColumn()
  applicantDetailsId: number;

  @Column({ nullable: false })
  expertise: string;

  @Column({ nullable: false })
  experience: string;

  @Column({ nullable: false })
  education: string;

  @Column({ nullable: false })
  skills: string;

  @Column({ nullable: false })
  languages: string;

  //
  @OneToOne(() => Applicant, (applicant) => applicant.applicantDetails)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;
}
