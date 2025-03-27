/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { usersModel } = require('../models')
const express = require("express")
const router = express.Router()
const { handleHttpError } = require("../utils/handleError");
const { matchedData } = require("express-validator");

const getItem = async (req, res) => {
    try {
        const { id } = matchedData(req); // Validación aplicada
        const data = await usersModel.findById(id);
        if (!data) {
            return handleHttpError(res, 'ITEM_NOT_FOUND', 404);
        }
        res.send(data);
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEM');
    }
}

const getItems = async (req, res) => {
    try {
        const data = await usersModel.find({})
        res.send(data)
    } catch (err) {
        //Si nos sirve el de por defecto que hemos establecido, no es necesario pasar el 403
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

const createItem = async (req, res) => {
    try {
        // Extrae los datos validados de la request
        const body = matchedData(req);
        // Ahora sí, crea el documento con esos datos
        const data = await usersModel.create(body);
        res.send(data);
    } catch (err) {
        console.log(err); // Muestra el error real en la consola
        handleHttpError(res, "ERROR_CREATE_ITEMS");
    }
};


const updateItem = async (req, res) => {
    try {
        const { id, ...body } = matchedData(req);
        const data = await usersModel.findByIdAndUpdate(id, body, { new: true });

        if (!data) {
            return handleHttpError(res, 'ITEM_NOT_FOUND', 404);
        }

        res.send(data);
    } catch (err) {
        handleHttpError(res, 'ERROR_UPDATE_ITEM');
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const data = await usersModel.delete({ _id: id });
        if (!data) {
            return handleHttpError(res, 'ITEM_NOT_FOUND', 404);
        }

        res.send({ message: 'Item deleted successfully', data });
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_ITEM');
    }
}

const onboardingCtrl = async (req, res) => {
    try {
        // El middleware de autenticación (authMiddleware) debe asignar req.user = usuario
        const user = req.user;
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Extraemos solo los campos validados del body
        const { name, lastname, nif } = matchedData(req, { locations: ["body"] });

        // Actualizamos los campos
        user.name = name;
        user.lastname = lastname;
        user.nif = nif;

        await user.save();

        res.send({ message: "Onboarding completed", user });
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR_ONBOARDING");
    }
};

// Datos de compañía
const companyCtrl = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Extraemos companyName, cif, address
        const { companyName, cif, address } = matchedData(req, { locations: ["body"] });

        if (user.isAutonomo) {
            user.name = companyName;
            user.nif = cif;
        } else {
            user.companyName = companyName;
            user.cif = cif;
            user.address = address;
        }

        await user.save();
        return res.send({ message: "Company data updated", user });
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR_UPDATE_COMPANY");
    }
};

const getUserByTokenCtrl = async (req, res) => {
    try {
        const user = req.user; // authMiddleware debe asignar req.user
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }
        // Ocultamos la contraseña si es necesario
        user.password = undefined;
        res.send({ user });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_GET_USER_BY_TOKEN");
    }
};

const deleteUserByTokenCtrl = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const { soft } = req.query;
        if (soft === "false") {
            usersModel.findByIdAndDelete(user._id);
            return res.send({ message: "User hard-deleted successfully" });
        } else {
            user.deleted = true;
            await user.save();
            return res.send({ message: "User soft-deleted successfully", user });
        }
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_DELETE_USER_BY_TOKEN");
    }
};


module.exports = {
    getItem,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    onboardingCtrl,
    companyCtrl,
    getUserByTokenCtrl,
    deleteUserByTokenCtrl
};