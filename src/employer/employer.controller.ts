import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Employer/Recruiter')
@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateEmployerDto) {
    try {
      let company = '';
      const user = await this.employerService.create(createUserDto, company);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const users = await this.employerService.findAll();
      return { success: true, data: users };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.employerService.findOne(+id);
  }

  // @Get('findOneByCompanyName/:companyName')
  // @CacheTTL(30)
  // async findOneByCompanyName(@Param('companyName') companyName: string) {
  //   try {
  //     const user = await this.employerService.findOneByCompanyName(companyName);
  //     return { success: true, data: user };
  //   } catch (err) {
  //     return { success: false, message: err.message };
  //   }
  // }

  @Get('findOneByEmail/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      const user = await this.employerService.findOneByEmail(email);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch('updateRecruiter')
  async update(@Body() updateUserDto: UpdateEmployerDto) {
    try {
      const user = await this.employerService.update(updateUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.employerService.remove(+id);
  }
}
