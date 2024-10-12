import IUser from './IUser';

interface IAppointment {
  id: number;
  date: string;
  time: string;
  description: string;
  userId: IUser;
  status: 'active' | 'cancelled';
}

export default IAppointment;

//cambiossss
