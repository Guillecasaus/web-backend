// controllers/auth.js
const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { usersModel } = require("../models");
const { tokenSign } = require("../utils/handleJwt");
const { handleHttpError } = require("../utils/handleError");

const registerCtrl = async (req, res) => {
    try {
        // Filtramos los datos con express-validator
        const body = matchedData(req);

        // Encriptamos la contraseña
        const password = await encrypt(body.password);
        const bodyWithPassword = { ...body, password };

        // Guardamos el usuario en la base de datos
        const dataUser = await usersModel.create(bodyWithPassword);

        // Ocultamos el password en la respuesta
        dataUser.set("password", undefined, { strict: false });

        // Generamos el token
        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        };
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR_REGISTER_USER");
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

module.exports = { registerCtrl, loginCtrl };
