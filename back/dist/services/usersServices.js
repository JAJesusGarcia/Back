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
exports.findUserWithTurns = exports.findUserById = exports.deleteUserServices = exports.getUserServices = exports.createUserServices = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const Appointment_1 = require("../entities/Appointment");
const Credential_1 = require("../entities/Credential");
const credentialsServices_1 = require("./credentialsServices");
const createUserServices = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting user creation process');
    console.log('Received userData:', userData);
    const queryRunner = data_source_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        console.log('Creating credential');
        const newCredential = yield (0, credentialsServices_1.createCredential)(userData.credentialsId.username, userData.credentialsId.password);
        console.log('Credential created successfully');
        console.log('Creating user');
        const newUser = new User_1.User();
        newUser.name = userData.name;
        newUser.lastName = userData.lastName;
        newUser.email = userData.email;
        // Convertir birthDate a objeto Date
        newUser.birthDate = new Date(userData.birthdate);
        if (isNaN(newUser.birthDate.getTime())) {
            throw new Error('Invalid birthDate format');
        }
        newUser.nDni = userData.nDni;
        newUser.numberPhone = userData.numberPhone;
        newUser.active = true;
        newUser.credentials = newCredential;
        console.log('Saving user to database');
        yield queryRunner.manager.save(User_1.User, newUser);
        console.log('User saved successfully');
        yield queryRunner.commitTransaction();
        console.log('Transaction committed');
        return newUser;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        console.error('Detailed error in createUserServices:', error);
        throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createUserServices = createUserServices;
const getUserServices = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.UserModel.find({
        relations: ['credentials'],
    });
});
exports.getUserServices = getUserServices;
const deleteUserServices = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = data_source_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        console.log('Buscando usuario con ID:', id);
        const user = yield data_source_1.UserModel.findOne({
            where: { id: Number(id) },
            relations: ['appointments', 'credentials'],
        });
        console.log('Usuario encontrado:', user);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        // Eliminar las citas asociadas
        if (user.appointments.length > 0) {
            yield Promise.all(user.appointments.map((appointment) => queryRunner.manager.remove(Appointment_1.Appointment, appointment)));
        }
        // Eliminar las credenciales asociadas
        if (user.credentials) {
            yield queryRunner.manager.remove(Credential_1.Credential, user.credentials);
        }
        // Eliminar el usuario
        yield queryRunner.manager.remove(User_1.User, user);
        yield queryRunner.commitTransaction();
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        console.error('Detailed error in deleteUserServices:', error);
        throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    finally {
        yield queryRunner.release();
    }
});
exports.deleteUserServices = deleteUserServices;
const findUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.UserModel.findOne({
        where: { id: Number(userId) },
        relations: ['credentials'],
    });
});
exports.findUserById = findUserById;
const findUserWithTurns = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.UserModel.findOne({
        where: { id: Number(userId) },
        relations: ['appointments'],
    });
});
exports.findUserWithTurns = findUserWithTurns;
