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
        const { id } = matchedData(req);
        const body = req.body;
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

module.exports = {
    getItem,
    getItems,
    createItem,
    updateItem,
    deleteItem
};