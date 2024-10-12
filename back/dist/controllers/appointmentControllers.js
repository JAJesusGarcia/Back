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
exports.deleteAppointment = exports.cancelAppointment = exports.scheduleAppointment = exports.getAppointment = exports.getAppointments = void 0;
const appointmentServices_1 = require("../services/appointmentServices");
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const appointments = yield (0, appointmentServices_1.getAppointmentsService)(userId ? Number(userId) : undefined);
        res.status(200).json(appointments); // Siempre devuelve 200
    }
    catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.getAppointments = getAppointments;
const getAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield (0, appointmentServices_1.getAppointmentById)(parseInt(id));
        if (appointment) {
            res.status(200).json(appointment);
        }
        else {
            res.status(404).json({ message: 'Turno no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.getAppointment = getAppointment;
const scheduleAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, description, userId } = req.body;
        if (!date || !time || !userId) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }
        const newAppointment = yield (0, appointmentServices_1.createAppointmentService)({
            date,
            time,
            description,
            userId,
        });
        res.status(201).json(newAppointment);
    }
    catch (error) {
        console.error('Error al programar cita:', error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});
exports.scheduleAppointment = scheduleAppointment;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cancelled = yield (0, appointmentServices_1.cancelAppointmentService)(parseInt(id));
        if (cancelled) {
            res.status(200).json({ message: 'Turno cancelado correctamente' });
        }
        else {
            res.status(404).json({ message: 'Turno no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.cancelAppointment = cancelAppointment;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield (0, appointmentServices_1.deleteAppointmentService)(parseInt(id));
    if (deleted) {
        res.status(200).json({ message: 'Turno eliminado correctamente' });
    }
    else {
        res.status(404).json({ message: 'Turno no encontrado' });
    }
});
exports.deleteAppointment = deleteAppointment;
