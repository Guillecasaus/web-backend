const { matchedData } = require("express-validator");
const { usersModel } = require("../models");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

// Función para generar un código de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCtrl = async (req, res) => {
    try {
        const body = matchedData(req);
        // Verificar email duplicado, cifrar password, etc.
        const password = await encrypt(body.password);
        const code = generateCode(); // Función que genera el código de 6 dígitos
        const userData = {
            ...body,
            password,
            verificationCode: code, // Guarda el código en la BD
            attempts: 3,
            status: "pending",
            role: "user"
        };

        const dataUser = await usersModel.create(userData);
        dataUser.set("password", undefined, { strict: false });

        const token = await tokenSign(dataUser);

        // Para pruebas, puedes incluir el código en la respuesta (pero en producción no se debe hacer)
        res.send({ token, user: dataUser, verificationCode: code });
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};

const loginCtrl = async (req, res) => {
    // Implementa la lógica de login
    res.send({ message: "Login to be implemented" });
};

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
                // Podrías marcarlo como "blocked", o borrar el user, etc.
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


module.exports = { registerCtrl, loginCtrl, validateEmailCtrl };
