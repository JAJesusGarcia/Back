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
exports.deleteAppointmentService = exports.cancelAppointmentService = exports.createAppointmentService = exports.getAppointmentById = exports.getAppointmentsService = void 0;
const data_source_1 = require("../config/data-source");
const Appointment_1 = require("../entities/Appointment");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
// const appointmentRepository = AppDataSource.getRepository(Appointment);
// const userRepository = AppDataSource.getRepository(User);
const getAppointmentsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId) {
        return yield data_source_1.AppointmentModel.find({
            where: { userId: (0, typeorm_1.Equal)(userId) },
            relations: ['user'],
        });
    }
    return yield data_source_1.AppointmentModel.find({ relations: ['user'] });
});
exports.getAppointmentsService = getAppointmentsService;
const getAppointmentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield data_source_1.AppointmentModel.findOne({
        where: { id },
        relations: ['user'],
    });
});
exports.getAppointmentById = getAppointmentById;
const convertToStatus = (status) => {
    switch (status.toLowerCase()) {
        case 'active':
            return Appointment_1.Status.ACTIVE;
        case 'cancelled':
            return Appointment_1.Status.CANCELLED;
        default:
            throw new Error(`Invalid status: ${status}`);
    }
};
const createAppointmentService = (appointmentData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryRunner = data_source_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const userId = Number(appointmentData.userId);
        if (isNaN(userId)) {
            throw new Error('ID de usuario inválido');
        }
        const user = yield queryRunner.manager.findOne(User_1.User, {
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        // Verificar si ya existe un appointment para este usuario en la misma fecha y hora
        const existingAppointment = yield queryRunner.manager.findOne(Appointment_1.Appointment, {
            where: {
                user: { id: userId },
                date: appointmentData.date,
                time: appointmentData.time,
                status: Appointment_1.Status.ACTIVE,
            },
        });
        if (existingAppointment) {
            throw new Error('Ya existe un turno activo para este usuario en la fecha y hora especificadas');
        }
        // Validar que la fecha y hora son futuras
        const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
        if (appointmentDateTime <= new Date()) {
            throw new Error('La fecha y hora del turno deben ser futuras');
        }
        const newAppointment = data_source_1.AppointmentModel.create({
            date: appointmentData.date,
            time: appointmentData.time,
            description: appointmentData.description,
            user: user,
            status: Appointment_1.Status.ACTIVE,
        });
        yield queryRunner.manager.save(newAppointment);
        yield queryRunner.commitTransaction();
        return newAppointment;
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        throw error;
    }
    finally {
        yield queryRunner.release();
    }
});
exports.createAppointmentService = createAppointmentService;
const cancelAppointmentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield data_source_1.AppointmentModel.findOneBy({ id });
    if (appointment) {
        appointment.status = Appointment_1.Status.CANCELLED;
        yield data_source_1.AppointmentModel.save(appointment);
        return true;
    }
    return false;
});
exports.cancelAppointmentService = cancelAppointmentService;
const deleteAppointmentService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_source_1.AppointmentModel.delete(id);
    return result.affected !== 0;
});
exports.deleteAppointmentService = deleteAppointmentService;
