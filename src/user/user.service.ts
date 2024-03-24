import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Applicant } from './entities/user.entity';
import { ApplicantDetails } from './entities/applicant.details.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantDetailsDto } from './dto/applicantDetails.dto';
import { Application } from 'src/application/entities/application.entity';
import { Job } from 'src/job/entities/job.entity';
import { WorkFlow } from 'src/workflow/entities/workflow.entity';
import { Stage } from 'src/workflow/entities/stage.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Applicant)
    private readonly userRepo: Repository<Applicant>,
    @InjectRepository(ApplicantDetails)
    private readonly applicantDetailsRepo: Repository<ApplicantDetails>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(WorkFlow)
    private readonly workflowRepo: Repository<WorkFlow>,
    @InjectRepository(Stage)
    private readonly stageRepo: Repository<Stage>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Applicant> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      password: hash,
    });

    await this.userRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    const users = await this.userRepo.find();
    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  findOne(id: number) {
    const user = this.userRepo.findOneBy({ id });
    return user;
  }

  async createApplicantDetails(
    id: number,
    applicantDetailsDto: ApplicantDetailsDto,
  ) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('Applicant not found');
    }

    const existingApplicantDetails = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (existingApplicantDetails) {
      const updatedApplicantDetails = await this.applicantDetailsRepo.merge(
        existingApplicantDetails,
        applicantDetailsDto,
      );

      return await this.applicantDetailsRepo.save(updatedApplicantDetails);
    } else {
      const newUserApplicantDetails = await this.applicantDetailsRepo.create({
        ...applicantDetailsDto,
        applicant: user,
      });
      return await this.applicantDetailsRepo.save(newUserApplicantDetails);
    }
  }

  async findApplicantDetails(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('Applicant not found');
    }

    const applicantDetails = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!applicantDetails) {
      throw new Error('Applicant details not found');
    }

    return applicantDetails;
  }

  //
  async updateContact(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateEducationDetails(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateExperienceDetails(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async updateSkills(id: number, updateUserDto) {
    const user = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
      relations: ['applicant'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.applicantDetailsRepo.merge(
      user,
      updateUserDto,
    );

    return await this.applicantDetailsRepo.save(updatedUser);
  }

  async findAllJobApplications(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const applications = await this.applicationRepo.find({
      where: { applicant: { id: id } },
      relations: ['applicant', 'job', 'stage'],
    });

    if (!applications) {
      throw new Error('No applications found');
    }

    return applications;
  }

  remove(id: number) {
    return `#${id} user deleted`;
  }
}
