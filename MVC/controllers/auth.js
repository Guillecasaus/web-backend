const { matchedData } = require("express-validator");
const { usersModel } = require("../models");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

// Función para generar un código de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCtrl = async (req, res) => {
    try {
        // Filtramos los datos validados
        const body = matchedData(req);

        // Encriptamos la contraseña
        const password = await encrypt(body.password);
        const bodyWithPassword = { ...body, password };

        // Generamos el código de verificación (ejemplo: 6 dígitos)
        const code = generateCode(); // Por ejemplo: () => Math.floor(100000 + Math.random() * 900000).toString();

        // Preparamos los datos del usuario, agregando el código, intentos y estado "pending"
        const userData = {
            ...bodyWithPassword,
            verificationCode: code,
            attempts: 3,
            status: "pending"
        };

        // Creamos el usuario en la BD
        const dataUser = await usersModel.create(userData);
        dataUser.set("password", undefined, { strict: false });

        // Generamos el token JWT
        const token = await tokenSign(dataUser);

        // Enviar correo con el código de verificación
        await sendEmail({
            subject: "Welcome to our platform - Verification Code",
            text: `Your verification code is: ${code}`,
            from: process.env.EMAIL,
            to: body.email
        });

        // Devolver la respuesta con el token y el usuario
        res.send({ token, user: dataUser });
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
