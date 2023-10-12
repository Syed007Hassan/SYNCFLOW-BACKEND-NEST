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
    return company;
  }

  create(createCompanyDto: CreateCompanyDto) {
    const newCompany = this.companyRepo.create(createCompanyDto);
    return this.companyRepo.save(newCompany);
  }

  findAll() {
    return `This action returns all company`;
  }

  async findOne(id: number) {
    const company = await this.companyRepo.findOneBy({ id });
    console.log(company + 'company');
    return company;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
