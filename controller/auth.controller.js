const authController = {};
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const userController = require("./user.controller");
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//인증
authController.authenticate = async (req, res,next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new Error("invalid Token");
        }

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                throw new Error("invalid Token");
            }
            req.userId = payload._id;
        });

        next();
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = authController;
