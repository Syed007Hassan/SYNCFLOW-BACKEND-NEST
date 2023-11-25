import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';

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
  @IsString()
  jobLocation: string;

  @ApiProperty()
  @IsString()
  jobSalary: string;

  @ApiProperty()
  @IsString()
  jobStatus: string;

  @ApiProperty()
  @IsString()
  jobQualification: string;

  @ApiProperty()
  @IsString()
  jobUrgency: string;

  @ApiProperty()
  @IsString()
  jobExperience: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  companyId: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  id: number | null;
}
