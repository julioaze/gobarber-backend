import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  // os métodos do constructor serão executados uma única vez.
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    try {
      const message = await this.client.sendMail({
        from: {
          name: from?.name || 'Equipe GoBarber',
          address: from?.email || 'equipe@gobarber.com.br',
        },
        to: {
          name: to.name,
          address: to.email,
        }, // list of receivers
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    } catch (error) {
      console.log(error);
    }
  }
}
