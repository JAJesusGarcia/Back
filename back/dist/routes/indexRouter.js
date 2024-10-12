"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./userRouter"));
const appointmentRouter_1 = __importDefault(require("./appointmentRouter"));
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
const emailRouter_1 = __importDefault(require("./emailRouter"));
const router = (0, express_1.Router)();
router.use('/users', autenticacion_1.default, userRouter_1.default);
router.use('/appointments', appointmentRouter_1.default);
router.use('/emails', emailRouter_1.default);
exports.default = router;
