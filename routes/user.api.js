const express =require('express');
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const router = express.Router();

// 회원가입(POST)
router.post("/", userController.createUser);

// 로그인(POST)
router.post("/login", userController.loginWithEmail);
router.get("/me", authController.authenticate, userController.getUser);

module.exports = router;
