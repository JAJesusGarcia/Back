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
exports.deleteUser = exports.loginUser = exports.registerUser = exports.getUserById = exports.getUsers = void 0;
const usersServices_1 = require("../services/usersServices");
const credentialsServices_1 = require("../services/credentialsServices");
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return '';
    }
    return date.toISOString().split('T')[0];
}
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, usersServices_1.getUserServices)();
    res.status(200).json(users);
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield (0, usersServices_1.findUserWithTurns)(id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.getUserById = getUserById;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received registration data:', req.body);
    try {
        const userData = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            birthdate: req.body.birthdate,
            nDni: req.body.nDni,
            numberPhone: req.body.numberPhone,
            credentialsId: {
                username: req.body.credentialsId.username,
                password: req.body.credentialsId.password,
            },
        };
        console.log('Processed userData:', userData);
        const newUser = yield (0, usersServices_1.createUserServices)(userData);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error en el registro:', error);
        if (error instanceof Error) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                res.status(400).json({ message: 'Username or email already exists' });
            }
            else {
                res
                    .status(500)
                    .json({ message: `Error creating user: ${error.message}` });
            }
        }
        else {
            res.status(500).json({ message: 'Error creating user: Unknown error' });
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log('Attempting login for user:', username);
        const user = yield (0, credentialsServices_1.validateCredential)({ username, password });
        if (user) {
            console.log('Login successful for user:', username);
            res.status(200).json({
                login: true,
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    numberPhone: user.numberPhone,
                    birthdate: formatDate(user.birthDate),
                    nDni: user.nDni.toString(), // Asegúrate de que esto sea una cadena
                },
            });
        }
        else {
            console.log('Login failed: Invalid credentials for user:', username);
            res.status(400).json({ message: 'Credenciales incorrectas' });
        }
    }
    catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, usersServices_1.deleteUserServices)(id);
        res.status(200).json({ message: 'Eliminado correctamente' });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes('Usuario no encontrado')) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
        else {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.deleteUser = deleteUser;
