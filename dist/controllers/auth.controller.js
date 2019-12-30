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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const schemas_1 = require("../validation-schema/schemas");
exports.signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body || {};
    const { error } = yield schemas_1.signUpValidationSchema.validate({
        username,
        email,
        password
    });
    if (error)
        return res.status(400).json(error);
    const user = new User_1.default({
        username,
        email,
        password
    });
    user.password = yield user.encryptPassword(user.password);
    const savedUser = yield user.save();
    const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || 'tokensecret');
    res.header('auth-token', token).json(savedUser);
});
exports.signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body || {};
    const { error } = yield schemas_1.signInValidationSchema.validate({ email, password });
    if (error)
        return res.status(400).json(error);
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.status(400).json('Email or password is incorrect!');
    const correctPassword = yield user.validatePassword(password);
    if (!correctPassword)
        return res.status(400).json('Password is incorrect!');
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'tokensecret', {
        expiresIn: 60 * 60 * 24
    });
    res.header('auth-token', token).json(user);
});
exports.profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield User_1.default.findById(userId, { password: 0 });
    if (!user)
        return res.status(404).json('User not found!');
    res.json(user);
});
//# sourceMappingURL=auth.controller.js.map