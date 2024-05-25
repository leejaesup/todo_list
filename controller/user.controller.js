const User = require("../model/User");
const bcrypt = require('bcrypt');
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
    } catch (err) {
        //400 Bad Request
        res.status(400).json({status: "fail", error: err});
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
    } catch (err) {
        //400 Bad Request
        res.status(400).json({status: "fail", error: err});
    }
}


//READ(GET)
userController.getTask = async (req, res) => {
    try {
        // const taskList = await Task.find({}).select("-_id -__v");
        const taskList = await Task.find({}).select("-__v");

        res.status(200).json({status: "ok", data: taskList});
    } catch (err) {
        res.status(400).json({status: "fail", error: err});
    }
}

//UPDATE(PUT)
userController.updateTask = async (req, res) => {
    try {
        const updateTask = await Task.findById(req.params.id);

        if (!updateTask) {
            return res.status(404).json({ status: "fail", error: "Task ID를 찾을 수 없습니다." });
        }

        const fields = Object.keys(req.body);

        fields.map((item) => (
            updateTask[item] = req.body[item]
        ));
        await updateTask.save();

        res.status(200).json({status: "ok", data: updateTask});
    } catch (err) {
        res.status(400).json({status: "fail", error: err});
    }
}

//DELETE(DELETE)
userController.deleteTask = async (req, res) => {
    try {
        const deleteItem = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", data: deleteItem });
    } catch (error) {
        res.status(400).json({ status: "fail", error });
    }
}

module.exports = userController;
