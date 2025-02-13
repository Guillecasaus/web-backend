/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { tracksModel } = require('../models')

const getItem = async (req, res) => {
    const { id } = req.params
    const data = await tracksModel.findOne({ _id: id })
    res.send(data)
}

const getItems = async (req, res) => {
    const data = await tracksModel.find({})
    res.send(data)
}
const createItem = async (req, res) => {
    const { body } = req
    //console.log(body)
    const data = await
        tracksModel.create(body)
    res.send(data)
}

module.exports = {
    getItem,
    getItems,
    createItem
};