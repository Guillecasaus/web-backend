const { matchedData } = require("express-validator");
const { usersModel } = require("../models");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");
const { generateResetToken } = require("../utils/handleResetToken");

// Función para generar un código de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCtrl = async (req, res) => {
    try {
        const body = matchedData(req);

        const userExists = await usersModel.findOne({ email: body.email });
        if (userExists) {
            return handleHttpError(res, "EMAIL_ALREADY_EXISTS", 409);
        }

        const passwordHash = await encrypt(body.password);
        const code = generateCode();
        const userData = {
            name: body.name,
            email: body.email,
            password: passwordHash,
            verificationCode: code,
            attempts: 3,
            status: "pending"
        };

        if (body.role) {
            userData.role = body.role;
        }

        const newUser = await usersModel.create(userData);
        newUser.set("password", undefined, { strict: false });

        const token = await tokenSign(newUser);

        res.send({ token, user: newUser, verificationCode: code });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "ERROR_REGISTER_USER" });
    }
};


const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const user = await usersModel.findOne({ email: req.email }).select("password name role email")
        if (!user) {
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }
        const hashPassword = user.password;
        const check = await compare(req.password, hashPassword)
        if (!check) {
            handleHttpError(res, "INVALID_PASSWORD", 401)
            return
        }
        user.set("password", undefined, { strict: false })
        const data = {
            token: await tokenSign(user),
            user
        }
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

const validateEmailCtrl = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Boqueo si el usuario ya está en estado "blocked"
        if (user.status === "blocked") {
            return res.status(403).json({ error: "USER_BLOCKED. Please request a new verification code." });
        }

        const { code } = matchedData(req);

        if (user.verificationCode === code) {
            user.status = "verified";
            user.verificationCode = undefined;
            user.attempts = 3;
            await user.save();
            return res.send({ message: "Email verified successfully" });
        } else {
            user.attempts -= 1;

            if (user.attempts <= 0) {
                user.status = "blocked";
                await user.save();
                return res.status(400).json({ error: "MAX_ATTEMPTS_EXCEEDED. User blocked." });
            }

            await user.save();
            return res.status(400).json({
                error: "Invalid verification code",
                attemptsLeft: user.attempts
            });
        }
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR_EMAIL_VALIDATION");
    }
};

const resendVerificationCodeCtrl = async (req, res) => {
    try {
        const user = await usersModel.findById(req.user._id);

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const newCode = generateCode();
        console.log("Nuevo código generado:", newCode);

        user.verificationCode = newCode;
        user.attempts = 3;
        user.status = "pending";

        await user.save();

        return res.send({
            message: "Verification code resent. Check your email.",
            verificationCode: newCode
        });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_RESEND_VERIFICATION_CODE");
    }
};



const recoverPasswordCtrl = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await usersModel.findOne({ email });
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Generar token
        const resetToken = generateResetToken();
        const expires = Date.now() + 3600000;

        user.resetToken = resetToken;
        user.resetTokenExpires = expires;
        await user.save();

        // Enviar correo al usuario con el token o un enlace
        res.send({ message: "Check your email for reset instructions" });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_RECOVER_PASSWORD");
    }
};

const resetPasswordCtrl = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await usersModel.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return handleHttpError(res, "INVALID_OR_EXPIRED_TOKEN", 400);
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await encrypt(newPassword);
        user.password = hashedPassword;

        // Limpiar el token para que no se reutilice
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();
        res.send({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_RESET_PASSWORD");
    }
};

const verifyResetTokenCtrl = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await usersModel.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return handleHttpError(res, "INVALID_OR_EXPIRED_TOKEN", 400);
        }

        res.send({ message: "Token is valid" });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_VERIFY_RESET_TOKEN");
    }
};

module.exports = { registerCtrl, loginCtrl, validateEmailCtrl, recoverPasswordCtrl, resetPasswordCtrl, verifyResetTokenCtrl, resendVerificationCodeCtrl };
