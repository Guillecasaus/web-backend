/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */

const { usersModel } = require('../models')

const getItems = async (req, res) => {
    const data = await usersModel.find({})
    res.send(data)
}
const createItem = async (req, res) => {
    const { body } = req
    //console.log(body)
    const data = await
    usersModel.create(body)
    res.send(data)
}

module.exports = {
    getItems,
    createItem
};