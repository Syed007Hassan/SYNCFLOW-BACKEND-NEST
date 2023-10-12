import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyService.create(createCompanyDto);
      return { success: true, data: company };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get('findOne/:id')
  async findOne(@Param('id') id: string) {
    try {
      const company = await this.companyService.findOne(+id);
      return { success: true, data: company };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
