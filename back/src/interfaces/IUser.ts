import { Credential } from '../entities/Credential';

export default interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  nDni: number;
  numberPhone: number;
  active: boolean;
  credentials: Credential;
}
