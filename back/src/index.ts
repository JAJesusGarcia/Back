import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import server from './server';
import { PORT } from './config/envs';
import {
  preloadUserData,
  preloadAppointmentsData,
} from './helpers/preloadData';

const initializateApp = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos realizada con éxito');

    await preloadUserData();
    await preloadAppointmentsData();

    server.listen(PORT, () => {
      console.log(`servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error durante la inicialización de la aplicación:', error);
    process.exit(1);
  }
};

initializateApp();
// AppDataSource.initialize().then((res) => {
//   console.log('Conexion a la base de datos realizada con éxito');
//   server.listen(PORT, () => {
//     console.log(`server listening on port ${PORT}`);
//   });
// });

// const initializateApp = async () => {
//   await AppDataSource.initialize();
//   await preloadUserData();
//   await preloadCredentialsData();
//   server.listen(PORT, () => {
//     console.log(`server listening on port ${PORT}`);
//   });
// };

// initializateApp();

// AppDataSource.initialize().then((res) => {
//   console.log('Conexion a la base de datos realizada con éxito');
//   preloadData().then((res) => {
//     server.listen(PORT, () => {
//       console.log(`server listening on port ${PORT}`);
//     });
//   });
// });
