import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentsService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentsService;

describe('createappointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 13, 16).getTime();
    });

    const apppointment = await createAppointment.execute({
      date: new Date(2020, 6, 13, 16),
      user_id: 'user_id',
      provider_id: 'provider_id',
    });

    expect(apppointment).toHaveProperty('id');
    expect(apppointment.provider_id).toBe('provider_id');
  });

  it('should be able to create two appointments on the same date', async () => {
    const appointmenteDate = new Date(2020, 6, 14, 16);

    await createAppointment.execute({
      date: appointmenteDate,
      user_id: 'user_id',
      provider_id: 'provider_id',
    });

    await expect(
      createAppointment.execute({
        date: appointmenteDate,
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // não permitir agendamento em datas passadas
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 13, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 13, 11),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // não permitir agendamento com você mesmo
  it('should not be able to create an appointment with user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 13, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 13, 13),
        user_id: 'user_id',
        provider_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // não permitir agendamento antes das 8h e após 17h
  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 13, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 14, 7),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 6, 14, 18),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
