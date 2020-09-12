import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRespository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRespository: FakeAppointmentsRespository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRespository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRespository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all appointments in a day', async () => {
    const appointment1 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 7, 16, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRespository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 7, 16, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 8,
      day: 16,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
