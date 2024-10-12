import { AppDataSource } from '../config/data-source';
import { Credential } from '../entities/Credential';
import { User } from '../entities/User';

// Importa CredentialRepository desde el data source
const CredentialRepository = AppDataSource.getRepository(Credential);
const UserRepository = AppDataSource.getRepository(User);

export const createCredential = async (
  username: string,
  password: string,
): Promise<Credential> => {
  const newCredential = new Credential();
  newCredential.username = username;
  newCredential.password = password; // Almacena la contraseña en texto claro
  return await AppDataSource.manager.save(newCredential);
};

export const validateCredential = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<User | null> => {
  const credentials = await CredentialRepository.findOne({
    where: { username },
  });

  if (!credentials) {
    return null; // Usuario no encontrado
  }

  if (credentials.password !== password) {
    return null; // Contraseña incorrecta
  }

  // Encuentra el usuario asociado con las credenciales
  const user = await UserRepository.findOne({
    where: { id: credentials.id }, // Asegúrate de tener la relación correcta
  });

  return user || null; // Retorna el usuario asociado o null si no se encuentra
};

// import { CredentialModel } from '../config/data-source';
// import { Credential } from '../entities/Credential';
// import { User } from '../entities/User';
// import ICredentailDto from '../dto/CredentialDto';

// export const createCredential = async (
//   username: string,
//   password: string,
// ): Promise<Credential> => {
//   console.log('Creating credential for username:', username);
//   try {
//     const newCredential = CredentialModel.create({ username, password });
//     await CredentialModel.save(newCredential);
//     console.log('Credential created successfully');
//     return newCredential;
//   } catch (error) {
//     console.error('Error in createCredential:', error);
//     throw new Error(
//       `Failed to create credential: ${error instanceof Error ? error.message : 'Unknown error'}`,
//     );
//   }
// };

// export const validateCredential = async (
//   credentialss: ICredentailDto,
// ): Promise<User | null> => {
//   const { username, password } = credentialss;
//   const credential = await CredentialModel.findOne({
//     where: { username, password },
//     relations: ['user'],
//   });
//   return credential?.user || null;
// };
