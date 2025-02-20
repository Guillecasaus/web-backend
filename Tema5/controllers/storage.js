const { storageModel } = require('../models')
const fs = require('fs')

const createItem = async (req, res) => {
    const id = req.params.id
    const fileBuffer = req.file.buffer
    const fileName = req.file.originalname
    const pinataResponse = await uploadToPinata(fileBuffer, fileName)
    const ipfsFile = pinataResponse.IpfsHash
    const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`

    const fileData = {
        filename: file.fileName,
        url: ipfs,
    }
    const data = await storageModel.create(fileData)
    res.send(data)
}

const updateImage = async (req, res) => {
    try {
        const id = req.params.id
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await userModel.findOneAndUpdate({ _id: id }, { image: ipfs }, { new: true })
        res.send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        //handleHttpError(res, "ERROR_UPLOAD_COMPANY_IMAGE")
    }
}

module.exports = {
    createItem,
    updateImage
};
