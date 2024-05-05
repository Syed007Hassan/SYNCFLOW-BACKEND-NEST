import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ default: 'pending' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ default: 'pending' })
  @IsNotEmpty()
  @IsString()
  applicationFeedback: string;

  @ApiProperty({ default: '0%' })
  @IsNotEmpty()
  @IsString()
  applicationRating: string;
}
