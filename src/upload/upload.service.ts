import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Applicant } from 'src/user/entities/user.entity';
import { ApplicantDetails } from 'src/user/entities/applicant.details.entity';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private AWS_S3_BUCKET_NAME: string;

  constructor(
    @InjectRepository(Company)
    public readonly companyRepo: Repository<Company>,
    @InjectRepository(Applicant)
    public readonly applicantRepo: Repository<Applicant>,
    @InjectRepository(ApplicantDetails)
    public readonly applicantDetailsRepo: Repository<ApplicantDetails>,
  ) {}

  async onModuleInit() {
    this.AWS_S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  async uploadResume(id: number, file) {
    const existingUserProfile = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
    });

    if (!existingUserProfile) {
      throw new Error('User does not exist');
    }

    const { originalname } = file;

    try {
      const uploadedData = await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET_NAME,
        'resume/' + originalname,
        file.mimetype,
      );

      if (uploadedData) {
        existingUserProfile.resume = uploadedData.Location;
        await this.applicantDetailsRepo.save(existingUserProfile);
        return uploadedData;
      }
    } catch (err) {
      return err.message;
    }
  }

  async uploadProfilePicture(id: number, file) {
    const existingUserProfile = await this.applicantDetailsRepo.findOne({
      where: { applicant: { id: id } },
    });

    if (!existingUserProfile) {
      throw new Error('User does not exist');
    }

    const { originalname } = file;

    try {
      const uploadedData = await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET_NAME,
        'applicantProfile/' + originalname,
        file.mimetype,
      );

      if (uploadedData) {
        existingUserProfile.profilePicture = uploadedData.Location;
        await this.applicantDetailsRepo.save(existingUserProfile);
        return uploadedData;
      }
    } catch (err) {
      return err.message;
    }
  }

  async uploadCompanyProfilePicture(companyId: number, file) {
    const existingCompany = await this.companyRepo.findOne({
      where: { companyId: companyId },
    });

    if (!existingCompany) {
      throw new Error('Company does not exist');
    }

    const { originalname } = file;

    try {
      const uploadedData = await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET_NAME,
        'companyProfile/' + originalname,
        file.mimetype,
      );

      if (uploadedData) {
        existingCompany.companyProfile = uploadedData.Location;
        await this.companyRepo.save(existingCompany);
        return uploadedData;
      }
    } catch (err) {
      return err.message;
    }
  }

  async uploadFile(file) {
    const { originalname } = file;
    console.log(this.AWS_S3_BUCKET_NAME);

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET_NAME,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_S3_REGION,
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
