/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { tracksModel } = require('../models')

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
    getItems,
    createItem
};