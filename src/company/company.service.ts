import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    public readonly companyRepo: Repository<Company>,
  ) {}

  async findOneByName(name: string) {
    const capitalizedCompanyName = name.charAt(0).toUpperCase() + name.slice(1);
    const company = await this.companyRepo.findOne({
      where: { companyName: capitalizedCompanyName },
    });
    if (!company) {
      return null;
    }
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
    const companies = await this.companyRepo.find();
    if (!companies) {
      throw new Error('No companies found');
    }

    return companies;
  }

  async findOne(id: number) {
    const company = await this.companyRepo.findOneBy({ id });
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const existingCompany = await this.companyRepo.findOneBy({
      id,
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