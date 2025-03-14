// middleware/authMiddleware.js
const { verifyToken } = require("../utils/handleJwt");
const { usersModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ").pop(); // "Bearer <token>"
        if (!token) {
            return handleHttpError(res, "NOT_TOKEN", 401);
        }

        const dataToken = verifyToken(token); // Decodifica el JWT
        if (!dataToken?._id) {
            return handleHttpError(res, "ERROR_ID_TOKEN", 401);
        }

        // Busca el usuario en la BD
        const user = await usersModel.findById(dataToken._id);
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Adjunta el usuario al req
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        handleHttpError(res, "NOT_SESSION", 401);
    }
};

module.exports = authMiddleware;
