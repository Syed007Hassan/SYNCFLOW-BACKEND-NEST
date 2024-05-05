import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

class LocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;
}

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  jobTitle: string;

  @ApiProperty()
  @IsString()
  jobDescription: string;

  @ApiProperty()
  @IsString()
  jobType: string;

  @ApiProperty()
  @IsString()
  jobCategory: string;

  @ApiProperty()
  @IsNotEmpty()
  jobLocation: LocationDto;

  @ApiProperty()
  @IsString()
  jobSalary: string;

  @ApiProperty()
  @IsString()
  jobStatus: string;

  @ApiProperty()
  @IsString()
  jobQualification: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  jobSkills: string[];

  @ApiProperty()
  @IsString()
  jobUrgency: string;

  @ApiProperty()
  @IsString()
  jobExperience: string;

  @ApiProperty()
  @IsString()
  restrictedLocationRange: string;
}
