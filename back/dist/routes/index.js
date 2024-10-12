"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersControllers_1 = require("../controllers/usersControllers");
const router = (0, express_1.Router)();
router.post("/users", usersControllers_1.createUser);
router.get("/users", usersControllers_1.getUser);
router.delete("/users", usersControllers_1.deleteUser);
exports.default = router;
