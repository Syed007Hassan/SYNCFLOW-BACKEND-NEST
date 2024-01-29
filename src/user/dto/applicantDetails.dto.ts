import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmpty, IsNotEmpty } from 'class-validator';

export class ApplicantDetailsDto {
  @IsNotEmpty()
  @IsString()
  expertise: string;

  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  skills: string;

  @IsNotEmpty()
  @IsString()
  languages: string;
}
