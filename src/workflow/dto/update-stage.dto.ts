import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  stageName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
