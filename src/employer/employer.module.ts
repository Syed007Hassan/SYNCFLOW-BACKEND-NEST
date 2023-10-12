import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './entities/employer.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter]), CompanyModule],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
