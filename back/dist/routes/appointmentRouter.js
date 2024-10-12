"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/appointmentRoutes.ts
const express_1 = require("express");
const appointmentControllers_1 = require("../controllers/appointmentControllers");
const router = (0, express_1.Router)();
router.get('/', appointmentControllers_1.getAppointments);
router.get('/:id', appointmentControllers_1.getAppointment);
router.post('/', appointmentControllers_1.scheduleAppointment);
router.put('/cancel/:id', appointmentControllers_1.cancelAppointment);
router.delete('/:id', appointmentControllers_1.deleteAppointment);
exports.default = router;
