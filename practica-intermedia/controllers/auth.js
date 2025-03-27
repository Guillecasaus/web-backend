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

        const password = await encrypt(body.password);
        const code = generateCode();
        const userData = {
            ...body,
            password,
            verificationCode: code,
            attempts: 3,
            status: "pending",
            role: "user"
        };

        const dataUser = await usersModel.create(userData);
        dataUser.set("password", undefined, { strict: false });

        const token = await tokenSign(dataUser);

        res.send({ token, user: dataUser, verificationCode: code });
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
        const user = req.user; // El middleware authMiddleware te adjunta el usuario en req.user
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const { code } = matchedData(req);

        // Comprobamos si el código coincide
        if (user.verificationCode === code) {
            // Si coincide, marcamos el status como "verified"
            user.status = "verified";
            await user.save();
            return res.send({ message: "Email verified successfully" });
        } else {
            // Si el código no coincide, restamos intentos
            user.attempts -= 1;

            // Si ya no quedan intentos, podrías bloquear al usuario o devolver un error especial
            if (user.attempts <= 0) {
                user.status = "blocked";
                await user.save();
                return res.status(400).json({ error: "MAX_ATTEMPTS_EXCEEDED. User blocked." });
            }

            // Guardamos la disminución de attempts
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


module.exports = { registerCtrl, loginCtrl, validateEmailCtrl, recoverPasswordCtrl, resetPasswordCtrl, verifyResetTokenCtrl };
