import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  companyEmail: string;

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
