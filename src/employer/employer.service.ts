import { Injectable } from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruiter } from './entities/employer.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly employerRepo: Repository<Recruiter>,
    private readonly companyService: CompanyService,
  ) {}

  async create(createUserDto: CreateEmployerDto): Promise<Recruiter> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.employerRepo.create({
      ...createUserDto,
      password: hash,
    });

    await this.employerRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    const users = await this.employerRepo.find();
    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.employerRepo.findOneBy({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneByCompanyName(companyName: string) {
    const company = await this.companyService.findOneByName(companyName);
    if (!company) {
      throw new Error('Company not found');
    }
    const employer = await this.employerRepo.findOne({
      where: { companyId: company.id },
    });

    if (!employer) {
      throw new Error('Employer not found');
    }
    return employer;
  }

  findOne(id: number) {
    const user = this.employerRepo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(updateUserDto: UpdateEmployerDto) {
    const existingRecruiter = await this.employerRepo.findOneBy({
      email: updateUserDto.email,
    });

    console.log(existingRecruiter + 'existingRecruiter');

    if (!existingRecruiter) {
      throw new Error('User not found');
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(updateUserDto.password, saltRounds);

    const updatedRecruiter = {
      ...existingRecruiter,
      ...updateUserDto,
      password: hash,
    };

    return await this.employerRepo.save(updatedRecruiter);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
