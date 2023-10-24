import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/model/role.enum';
import { Application } from 'src/application/entities/application.entity';

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: Role.Employee })
  role: string;

  @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[];

  // @OneToMany((type) => Comment, (comment) => comment.user)
  // comments: Comment[];

  // @BeforeInsert()
  // async hashPasword() {
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
}
