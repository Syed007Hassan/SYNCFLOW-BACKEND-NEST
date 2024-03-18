import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Employer/Recruiter')
@Controller('recruiter')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const users = await this.employerService.findAll();
      return { success: true, data: users };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOne/:recruiterId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('recruiterId') recruiterId: string) {
    try {
      const user = await this.employerService.findOne(+recruiterId);
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findByCompanyName/:companyName')
  @CacheTTL(30)
  @HttpCode(HttpStatus.OK)
  async findOneByCompanyName(@Param('companyName') companyName: string) {
    try {
      const user =
        await this.employerService.findEmployeeByCompanyName(companyName);
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findByCompanyId/:companyId')
  @CacheTTL(30)
  @HttpCode(HttpStatus.OK)
  async findByCompanyId(@Param('companyId') companyId: string) {
    try {
      const user =
        await this.employerService.findEmployeeByCompanyId(+companyId);
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findOneByEmail/:email')
  @HttpCode(HttpStatus.OK)
  async findOneByEmail(@Param('email') email: string) {
    try {
      const user = await this.employerService.findOneByEmail(email);
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('updateRecruiter')
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateUserDto: UpdateEmployerDto) {
    try {
      const user = await this.employerService.update(updateUserDto);
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('updateRegisteredEmployee/:recruiterId/:employeeId')
  @HttpCode(HttpStatus.OK)
  async updateRegisteredEmployee(
    @Param('recruiterId') recruiterId: string,
    @Param('employeeId') employeeId: string,
    @Body() updateUserDto: UpdateEmployerDto,
  ) {
    try {
      const user = await this.employerService.updateRegisteredEmployee(
        +recruiterId,
        +employeeId,
        updateUserDto,
      );
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('deleteRegisteredEmployee/:recruiterId/:employeeId')
  @HttpCode(HttpStatus.OK)
  async deleteRegisteredEmployee(
    @Param('recruiterId') recruiterId: string,
    @Param('employeeId') employeeId: string,
  ) {
    try {
      const user = await this.employerService.deleteRegisteredEmployee(
        +recruiterId,
        +employeeId,
      );
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('findAllTheStagesAssignedToRecruiter/:recruiterId')
  @HttpCode(HttpStatus.OK)
  async findAllTheStagesAssignedToRecruiter(
    @Param('recruiterId') recruiterId: string,
  ) {
    try {
      const user =
        await this.employerService.findAllTheStagesAssignedToRecruiter(
          +recruiterId,
        );
      return { success: true, data: user };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.employerService.remove(+id);
  }
}
