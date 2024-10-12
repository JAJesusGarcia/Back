export default interface AppointmentDto {
  date: Date;
  time: string;
  description: string;
  userId: string;
  status?: string;
}
