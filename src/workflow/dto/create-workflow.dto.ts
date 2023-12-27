import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class StageDto {
  @ApiProperty()
  @IsString()
  stageName: string;

  @ApiProperty()
  @IsString()
  category: string;
}

export class CreateWorkFlowDto {
  @ApiProperty({ type: [StageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageDto)
  stages: StageDto[];
}
