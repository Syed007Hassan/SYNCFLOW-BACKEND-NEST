import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Applicant } from './entities/user.entity';
import { ApplicantDetails } from './entities/applicant.details.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApplicantDetailsDto } from './dto/applicantDetails.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Applicant)
    private readonly userRepo: Repository<Applicant>,
    @InjectRepository(ApplicantDetails)
    private readonly applicantDetailsRepo: Repository<ApplicantDetails>,
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

    // if (existingApplicantDetails) {
    //   const updatedApplicantDetails = await this.applicantDetailsRepo.merge(
    //     existingApplicantDetails,
    //     applicantDetailsDto,
    //   );

    //   return await this.applicantDetailsRepo.save(updatedApplicantDetails);
    // }

    // const newUserApplicantDetails = await this.applicantDetailsRepo.create({
    //   ...applicantDetailsDto,
    //   applicant: user,
    // });

    // return await this.applicantDetailsRepo.save(newUserApplicantDetails);
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
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `#${id} user deleted`;
  }
}
