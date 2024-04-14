import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async createEmail(createEmailDto: CreateEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: createEmailDto.to,
        from: createEmailDto.from,
        subject: createEmailDto.subject,
        text: createEmailDto.text,
        html: createEmailDto.html,
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
