"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailControllers_1 = require("../controllers/emailControllers");
const router = (0, express_1.Router)();
router.post('/send', emailControllers_1.sendEmail);
exports.default = router;
