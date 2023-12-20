import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class Assignee {
  @ApiProperty()
  @IsInt()
  recruiterId: number;

  @ApiProperty()
  @IsString()
  name: string;
}
export class AssignStageDto {
  @ApiProperty({ type: [Assignee] })
  @IsArray()
  @IsOptional()
  assignees: Assignee[];
}
