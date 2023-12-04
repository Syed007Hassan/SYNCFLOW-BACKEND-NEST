import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruiter } from './entities/employer.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly employerRepo: Repository<Recruiter>,
    private readonly companyService: CompanyService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(
    createUserDto: CreateEmployerDto,
    company: any,
  ): Promise<Recruiter> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = await this.employerRepo.create({
      ...createUserDto,
      password: hash,
      company: company,
    });

    await this.employerRepo.save(newUser);

    return newUser;
  }

  async findAll() {
    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>('all_recruiters');
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const employers = await this.employerRepo.find();
    if (!employers) {
      throw new Error('No recruiters found');
    }

    // set the cache:
    await this.cacheService.set('all_recruiters', employers);
    return employers;
  }

  async findOneByEmail(email: string) {
    // create a cache key based on the email:
    const cacheKey = `recruiter_email_${email}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const user = await this.employerRepo.findOneBy({ email });
    if (!user) {
      return null;
    }

    // set the cache:
    await this.cacheService.set(cacheKey, user);
    return user;
  }

  // async findOneByCompanyName(companyName: string) {
  //   // create a cache key based on the company name:
  //   const cacheKey = `recruiter_${companyName}`;

  //   // check if data is in cache:
  //   const cachedData = await this.cacheService.get<any>(cacheKey);
  //   if (cachedData) {
  //     console.log(`Getting data from cache!`);
  //     return cachedData;
  //   }

  //   // if not, fetch data from the database:
  //   const company = await this.companyService.findOneByName(companyName);
  //   if (!company) {
  //     throw new Error('Company not found');
  //   }
  //   const employer = await this.employerRepo.findOne({
  //     where: { companyId: company.id },
  //   });

  //   if (!employer) {
  //     throw new Error('Employer not found');
  //   }

  //   // set the cache with the cache key:
  //   await this.cacheService.set(cacheKey, employer);
  //   return employer;
  // }

  async findOne(id: number) {
    // create a cache key based on the id:
    const cacheKey = `recruiter_id_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const user = await this.employerRepo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, user);
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
