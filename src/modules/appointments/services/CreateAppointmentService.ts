import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

// a linha abaixo ainda causa um acoplamento na camada de infra
// mas como o DDD é uma metodologia, não precisamos aplicar todas as regras
// em todos os lugares.
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    // const cacheKey = `providers-appointments:${provider_id}:${year}:${month}:${day}`;
    const appointmentDate = startOfHour(date);

    // verifica se a data do agendamente é antes de agora
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cant create an appointment in a past date');
    }

    if (user_id === provider_id) {
      throw new AppError('You cant create an appointment with yourself');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create an appointment between 8am and 5pm',
      );
    }

    const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    // se encontrou uma data igual, retorna mensagem de erro
    if (findAppointmentsInSameDate) {
      throw new AppError('This appointmente is alread booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // envio de notificação ao criar um novo agendamento
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `providers-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
