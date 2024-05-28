const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// password와 같아 중요도가 높거나 무조건 제외해야 할 데이터가 있는 경우 사용
userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};

// userSchema.method.generateToken = async function() {
userSchema.methods.generateToken = function() {
    const token = jwt.sign({_id: this._id}, JWT_SECRET_KEY, {
        expiresIn:'1d'
    });
    return token;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
