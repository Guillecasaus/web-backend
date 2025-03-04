/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { tracksModel } = require('../models')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')

const getItem = async (req, res) => {
    try {
        const { id } = matchedData(req); // Validación aplicada
        const data = await tracksModel.findById(id);
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
        const user = req.user
        const data = await tracksModel.find({})
        res.send({ data, user })
    } catch (err) {
        //Si nos sirve el de por defecto que hemos establecido, no es necesario pasar el 403
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

const createItem = async (req, res) => {
    try {
        const body = matchedData(req) //El dato filtrado por el modelo (probar con body=req)
        const data = await tracksModel.create(body)
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_CREATE_ITEMS')
    }
}

const updateItem = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const body = req.body;
        const data = await tracksModel.findByIdAndUpdate(id, body, { new: true });

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
        const data = await tracksModel.delete({ _id: id });
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