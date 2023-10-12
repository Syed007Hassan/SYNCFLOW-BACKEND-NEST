import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployerDto } from './create-employer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateEmployerDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: number;

  @ApiProperty()
  @IsNotEmpty()
  designation: string;
}
