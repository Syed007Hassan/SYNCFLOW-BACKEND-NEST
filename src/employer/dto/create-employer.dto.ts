import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  isNotEmpty,
  isNumber,
} from 'class-validator';
import { Role } from 'src/auth/model/role.enum';
export class CreateEmployerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiProperty({ default: Role.Employer })
  @IsString()
  role: string;

  @ApiProperty()
  @IsNumber()
  companyId: number;
}
