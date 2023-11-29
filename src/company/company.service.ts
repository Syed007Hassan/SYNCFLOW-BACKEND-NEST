import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    public readonly companyRepo: Repository<Company>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findOneByName(name: string) {
    // create a cache key based on the name:
    const cacheKey = `company_name_${name}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // if not, fetch data from the database:
    const capitalizedCompanyName = name.charAt(0).toUpperCase() + name.slice(1);
    const company = await this.companyRepo.findOne({
      where: { companyName: capitalizedCompanyName },
    });
    if (!company) {
      return null;
    }

    // set the cache:
    await this.cacheService.set(cacheKey, company);
    return company;
  }

  create(createCompanyDto: CreateCompanyDto) {
    const capitalizedCompanyName =
      createCompanyDto.companyName.charAt(0).toUpperCase() +
      createCompanyDto.companyName.slice(1);
    const newCompany = this.companyRepo.create({
      ...createCompanyDto,
      companyName: capitalizedCompanyName,
    });
    return this.companyRepo.save(newCompany);
  }

  async findAll() {
    // create a cache key:
    const cacheKey = `all_companies`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const companies = await this.companyRepo.find();
    if (!companies) {
      throw new Error('No companies found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, companies);
    return companies;
  }

  async findOne(id: number) {
    // create a cache key based on the id:
    const cacheKey = `company_id_${id}`;

    // check if data is in cache:
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, fetch data from the database:
    const company = await this.companyRepo.findOneBy({ companyId: id });
    if (!company) {
      throw new Error('Company not found');
    }

    // set the cache:
    await this.cacheService.set(cacheKey, company);
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const existingCompany = await this.companyRepo.findOneBy({
      companyId: id,
    });

    if (!existingCompany) {
      throw new Error('Company not found');
    }

    const updatedCompany = {
      ...existingCompany,
      ...updateCompanyDto,
    };

    return await this.companyRepo.save(updatedCompany);
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
