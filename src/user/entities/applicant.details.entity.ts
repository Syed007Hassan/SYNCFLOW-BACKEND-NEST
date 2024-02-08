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
import { Education } from '../dto/education.interface';
import { ApplicantLocation } from '../dto/applicantLocation.interface';
@Entity('applicantDetails')
export class ApplicantDetails {
  @PrimaryGeneratedColumn()
  applicantDetailsId: number;

  @Column({ nullable: false })
  dob: Date;

  @Column({ nullable: false })
  gender: string;

  @Column({ nullable: false })
  aboutMe: string;

  @Column({ nullable: false, type: 'jsonb' })
  education: Education[];

  @Column({ nullable: false, type: 'jsonb' })
  skills: string[];

  @Column({ nullable: false, type: 'jsonb' })
  location: ApplicantLocation;

  @Column({ nullable: false })
  expertise: string;

  @Column({ nullable: false, type: 'jsonb' })
  experience: string;

  @Column({ nullable: false })
  languages: string;

  //
  @OneToOne(() => Applicant, (applicant) => applicant.applicantDetails)
  @JoinColumn({ name: 'id' })
  applicant: Applicant;
}
