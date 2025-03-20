const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const getProperties = require("../utils/handlePropertiesEngine")
const propertiesKey = getProperties()

const tokenSign = async (user) => {
    const sign = jwt.sign(
        {
            //_id: user._id,
            [propertiesKey.id]: user[propertiesKey.id], // [] propiedad dinámica
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
    return sign
}

const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (err) {
        console.log(err)
    }
}
module.exports = { tokenSign, verifyToken }