import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/auth/model/role.enum';
import { RoleGuard } from 'src/auth/guards/role-auth.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyService.create(createCompanyDto);
      return { success: true, data: company };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOneByName/:name')
  async findOneByName(@Param('name') name: string) {
    try {
      const company = await this.companyService.findOneByName(name);
      return { success: true, data: company };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const companies = await this.companyService.findAll();
      return { success: true, data: companies };
    } catch (err) {
      return { success: false, message: err.message };
    }
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

  @ApiBearerAuth()
  @HasRoles(Role.Employer)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('updateCompanyById/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const updatedCompany = await this.companyService.update(
        id,
        updateCompanyDto,
      );
      return { success: true, data: updatedCompany };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
