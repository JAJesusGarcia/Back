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
exports.preloadAppointmentsData = exports.preloadUserData = void 0;
const data_source_1 = require("../config/data-source");
const Appointment_1 = require("../entities/Appointment");
const User_1 = require("../entities/User");
const preloadUsers = [
    {
        name: 'Persona',
        lastName: 'Prueba',
        email: 'persona@example.com',
        birthDate: '1999-09-19',
        nDni: 41123123,
        numberPhone: 123456789,
        active: true,
        credentials: {
            username: 'persona123',
            password: 'Persona.123',
        },
    },
];
const preloadAppointments = [
    {
        date: '2024-08-02',
        time: '13:00',
        description: 'Desarrollo de Sitios Web',
        status: Appointment_1.Status.ACTIVE,
    },
];
const preloadUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!preloadUsers || !preloadUsers.length) {
        console.log('No hay datos de usuarios para precargar');
        return;
    }
    yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUsers = yield data_source_1.UserModel.find();
        if (existingUsers.length) {
            console.log('No se hizo la precarga de datos porque ya existen datos');
            return;
        }
        for (const user of preloadUsers) {
            // Crear credenciales
            const newCredential = data_source_1.CredentialModel.create(Object.assign({}, user.credentials));
            yield transactionalEntityManager.save(newCredential);
            // Crear usuario
            const newUser = data_source_1.UserModel.create(Object.assign(Object.assign({}, user), { birthDate: new Date(user.birthDate), numberPhone: user.numberPhone.toString(), credentials: newCredential }));
            yield transactionalEntityManager.save(newUser);
        }
        console.log('Precarga de datos realizada con éxito');
    }));
});
exports.preloadUserData = preloadUserData;
const preloadAppointmentsData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Limpiar citas existentes antes de agregar nuevas (opcional)
    // await AppDataSource.getRepository(Appointment).clear();
    const existinAppointments = yield data_source_1.AppointmentModel.count();
    if (existinAppointments > 0) {
        console.log('Ya existen turnos. No se realizará la precarga');
        return;
    }
    yield data_source_1.AppDataSource.manager.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        // Obtener todos los usuarios para asignar citas
        const users = yield transactionalEntityManager.find(User_1.User);
        if (users.length === 0) {
            console.warn('No se encontraron usuarios. No se pueden crear citas.');
            return;
        }
        // Insertar citas predefinidas
        for (const appointmentData of preloadAppointments) {
            // Convertir la fecha y hora a un objeto Date
            const dateObject = new Date(`${appointmentData.date}T${appointmentData.time}`);
            // Elegir un usuario al azar para asignar la cita (puedes ajustar esta lógica)
            const randomUser = users[Math.floor(Math.random() * users.length)];
            // Crear una nueva cita
            const newAppointment = data_source_1.AppointmentModel.create({
                date: dateObject,
                time: appointmentData.time,
                description: appointmentData.description,
                status: appointmentData.status,
                user: randomUser,
            });
            yield transactionalEntityManager.save(newAppointment);
        }
        console.log('Precarga de datos de citas realizada con éxito');
    }));
});
exports.preloadAppointmentsData = preloadAppointmentsData;
// const newUser1 = await UserModel.create(user1);
// const newUser2 = await UserModel.create(user2);
// const newUser3 = await UserModel.create(user3);
// const newUser4 = await UserModel.create(user4);
// await transactionalEntityManeger.save(newUser1);
// await transactionalEntityManeger.save(newUser2);
// await transactionalEntityManeger.save(newUser3);
// await transactionalEntityManeger.save(newUser4);
