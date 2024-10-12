"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
const usersControllers_1 = require("../controllers/usersControllers");
const router = (0, express_1.Router)();
router.post('/register', usersControllers_1.registerUser);
router.post('/login', usersControllers_1.loginUser);
router.get('/', autenticacion_1.default, usersControllers_1.getUsers);
router.get('/:id', usersControllers_1.getUserById);
router.delete('/:id', usersControllers_1.deleteUser);
exports.default = router;
// GET /user => Obtener todos los usuarios
// GET /user/:id => Obtener un usuario por su id
// POST /user/register => Crear un nuevo usuario
// POST /users/login => Login del usuario a la aplicación
