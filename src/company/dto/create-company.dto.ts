import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  companyEmail: string;

  @ApiProperty()
  @IsString()
  companyProfile: string;

  @ApiProperty()
  @IsString()
  companyWebsite: string;

  @ApiProperty()
  @IsString()
  companyAddress: string;

  @ApiProperty()
  @IsNumber()
  companyPhone: number;
}
