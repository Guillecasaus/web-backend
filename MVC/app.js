const express = require("express")
const cors = require("cors")
require('dotenv').config();
const dbConnect = require('./config/mongo')
const { sequelize, dbConnectMySql } = require("./config/mysql")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", require("./routes"))
app.use(express.static("storage"))

const port = process.env.PORT || 3000

if (process.env.ENGINE_DB === 'nosql') {
    dbConnect()
    // Crea las colecciones por defecto si no existieran
} else {
    dbConnectMySql()
    sequelize.sync() // Crea las tablas en la base de datos si no existieran
}


app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    dbConnect()
})