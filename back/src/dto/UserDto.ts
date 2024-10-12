import AppointmentDto from './AppointmentDto';
import CredentialDto from './CredentialDto';

interface UserDto {
  name: string;
  lastName: string;
  email: string;
  birthdate: string; // Cambiado a string ya que desde el frontend envías una cadena
  nDni: number;
  numberPhone: string; // Cambiado a string para mayor flexibilidad
  credentialsId: {
    username: string;
    password: string;
  };
  appointments?: AppointmentDto[]; // Opcional y como array
}

export default UserDto;
