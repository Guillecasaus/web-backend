const multer = require("multer")
require('dotenv').config();

const pinataApiKey = process.env.PINATA_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET;

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const pathStorage = __dirname + "/../storage"
        callback(null, pathStorage)
    },
    filename: function (req, file, callback) {

        const ext = file.originalname.split(".").pop()
        const filename = "file-" + Date.now() + "." + ext
        callback(null, filename)
    }
})

const uploadToPinata = async (fileBuffer, fileName) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    //const blob = new Blob([fileBuffer])
    //data.append('file', blob, fileName);
    data.append('file', fileBuffer, fileName);
    const metadata = JSON.stringify({
        name: fileName
    });
    data.append('pinataMetadata', metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Error al subir el archivo: ${response.statusText}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error al subir el archivo a Pinata:', error);
        throw error;
    }
};

const memory = multer.memoryStorage()

const uploadMiddleware = multer({ storage })
const uploadMiddlewareMemory = multer({ storage: memory })

module.exports = { uploadMiddleware, uploadMiddlewareMemory, uploadToPinata }
