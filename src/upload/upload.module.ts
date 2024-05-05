import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applicant } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { ApplicantDetails } from 'src/user/entities/applicant.details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applicant, ApplicantDetails, Company])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
