/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { tracksModel } = require('../models')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')

const getItem = async (req, res) => {
    const { id } = req.params
    const data = await tracksModel.findOne({ _id: id })
    res.send(data)
}

const getItems = async (req, res) => {
    try {
        const data = await tracksModel.find({})
        res.send(data)
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

module.exports = {
    getItem,
    getItems,
    createItem
};