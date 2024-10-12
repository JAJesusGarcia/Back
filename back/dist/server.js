"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const appointmentRouter_1 = __importDefault(require("./routes/appointmentRouter"));
const emailRouter_1 = __importDefault(require("./routes/emailRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const server = (0, express_1.default)();
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Si estás enviando cookies o encabezados de autorización
};
server.use((0, cors_1.default)(corsOptions));
server.use((0, morgan_1.default)('dev'));
server.use(express_1.default.json());
// Configuración de la sesión
server.use((0, express_session_1.default)({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Cambia a true en producción si usas HTTPS
}));
server.use('/users', userRouter_1.default);
server.use('/appointments', appointmentRouter_1.default);
server.use('/emails', emailRouter_1.default);
exports.default = server;
