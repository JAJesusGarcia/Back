"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredential = exports.createCredential = void 0;
const data_source_1 = require("../config/data-source");
const Credential_1 = require("../entities/Credential");
const User_1 = require("../entities/User");
// Importa CredentialRepository desde el data source
const CredentialRepository = data_source_1.AppDataSource.getRepository(Credential_1.Credential);
const UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const createCredential = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const newCredential = new Credential_1.Credential();
    newCredential.username = username;
    newCredential.password = password; // Almacena la contraseña en texto claro
    return yield data_source_1.AppDataSource.manager.save(newCredential);
});
exports.createCredential = createCredential;
const validateCredential = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = yield CredentialRepository.findOne({
        where: { username },
    });
    if (!credentials) {
        return null; // Usuario no encontrado
    }
    if (credentials.password !== password) {
        return null; // Contraseña incorrecta
    }
    // Encuentra el usuario asociado con las credenciales
    const user = yield UserRepository.findOne({
        where: { id: credentials.id }, // Asegúrate de tener la relación correcta
    });
    return user || null; // Retorna el usuario asociado o null si no se encuentra
});
exports.validateCredential = validateCredential;
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
