import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/model/role.enum';
import { Company } from 'src/company/entities/company.entity';

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: number;

  @Column({ nullable: true, default: Role.Employer })
  role: string;

  @Column({ nullable: true })
  designation: string;

  @ManyToOne((type) => Company, (company) => company.recruiters)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  companyId: number;
}
