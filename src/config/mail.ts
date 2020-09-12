// a interface garate que o JS entenda as opções e também limitamos
// para que somente as opções da interface sejam válidas
interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'hitsales@hitsales.com.br',
      name: 'GoBarber',
    },
  },
} as IMailConfig;
