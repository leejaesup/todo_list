const User = require("../model/User");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userController = {};

//회원가입(POST)
userController.createUser = async (req, res) => {
    try {
        const {email, name, password} = req.body;

        // 존재하는 계정인지 확인
        const user = await User.findOne({email});
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        console.log("hash:", hash);

        if (user) {
            throw new Error('이미 가입된 정보입니다.');
        }
        const newUser = new User({email, name, password:hash});
        await newUser.save();

        //200 Ok
        res.status(200).json({status: "success"}); // 가입이 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//로그인(POST)
userController.loginWithEmail = async (req, res) => {
    try {
        const {email, password} = req.body;

        // 존재하는 계정인지 확인
        const user = await User.findOne({email}, "-createdAt -updatedAt -__v");

        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                const token = user.generateToken();
                //200 Ok
                return res.status(200).json({status: "success", user, token});
            }
        }

        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//유저정보 가져오기
userController.getUser = async (req, res) => {
    try {
        const {userId} = req; //req.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw  new Error("can not found User");
        }

        //200 Ok
        res.status(200).json({status: "success", user});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = userController;
