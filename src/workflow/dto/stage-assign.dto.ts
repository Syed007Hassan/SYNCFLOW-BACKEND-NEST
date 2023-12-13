import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class AssignStageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  stageId: number;

  @ApiProperty({ example: [3, 4] })
  @IsArray()
  @IsInt({ each: true })
  assigneeIds: number[];
}
