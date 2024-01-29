import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmpty, IsNotEmpty } from 'class-validator';

export class ApplicantDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expertise: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  experience: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  education: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  skills: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  languages: string;
}
