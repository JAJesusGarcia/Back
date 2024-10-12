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
exports.deleteUser = exports.getUser = exports.createUser = void 0;
const usersServices_1 = require("../services/usersServices");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, active } = req.body;
    const newUser = yield (0, usersServices_1.createUserServices)({ name, email, active });
    res.status(201).json(newUser);
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, usersServices_1.getUserServices)();
    res.status(200).json(users);
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    yield (0, usersServices_1.deleteUserServices)(id);
    res.status(200).json({ message: "Eliminado correctamente" });
});
exports.deleteUser = deleteUser;
