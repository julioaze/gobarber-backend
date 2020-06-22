import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentsService from './CreateAppointmentSevice';

describe('createappointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentsService(
      fakeAppointmentsRepository,
    );

    const apppointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(apppointment).toHaveProperty('id');
    expect(apppointment.provider_id).toBe('123123');
  });

  it('should be able to create two appointments on the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentsService(
      fakeAppointmentsRepository,
    );

    const appointmenteDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmenteDate,
      provider_id: '123123',
    });

    await expect(
      createAppointment.execute({
        date: appointmenteDate,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
