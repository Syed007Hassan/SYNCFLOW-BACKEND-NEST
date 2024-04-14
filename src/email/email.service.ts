import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async create(createEmailDto: CreateEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: 'alisyedmuhammed@gmail.com',
        from: 'alisyedmuhammed@gmail.com',
        subject: 'Hello world!',
        text: 'Testing email',
        html: '<b>Testing email</b>',
      });
      return 'Email sent successfully';
    } catch (e) {
      return e;
    }
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
