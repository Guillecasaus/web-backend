const express = require("express")
const cors = require("cors")
require('dotenv').config();
const dbConnect = require('./config/mongo')
const loggerStream = require("./utils/handleLogger")
const morganBody = require("morgan-body")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", require("./routes"))
app.use(express.static("storage"))

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)
app.use("/api", require("./routes"))

const port = process.env.PORT || 3000

morganBody(app, {
    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 500
    },
    stream: loggerStream
})

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    dbConnect()
})