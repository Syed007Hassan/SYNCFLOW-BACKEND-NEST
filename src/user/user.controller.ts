import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApplicantDetailsDto } from './dto/applicantDetails.dto';

@ApiTags('User/Candidate')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { success: true, data: users };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('findOneByEmail/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Post('createApplicantDetails/:id')
  async createApplicantDetails(
    @Param('id') id: string,
    @Body() applicantDetailsDto: ApplicantDetailsDto,
  ) {
    try {
      const user = await this.userService.createApplicantDetails(
        +id,
        applicantDetailsDto,
      );
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Get('findApplicantDetails/:id')
  async findApplicantDetails(@Param('id') id: string) {
    try {
      const user = await this.userService.findApplicantDetails(+id);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Patch('updateContactDetails/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNo: { type: 'string' },
        location: {
          type: 'object',
          properties: {
            area: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            latitude: { type: 'string' },
            longitude: { type: 'string' },
          },
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto) {
    try {
      const user = this.userService.updateContact(+id, updateUserDto);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
