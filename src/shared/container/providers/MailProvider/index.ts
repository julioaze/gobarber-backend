// map email providers
import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

// o container.resolve é que será responsável pela injeção de dependencia
// ou seja, ele verificará e o constructor tem os injects para injetar
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
