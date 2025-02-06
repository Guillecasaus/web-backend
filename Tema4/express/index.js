const express = require('express');
const { config } = require('dotenv');
const { infoCursos } = require('./datos/cursos.js');

const app = express();
config();

app.use(express.json());


const routerProgramacion = require('./routers/programacion');
const routerMatematicas = require('./routers/matematicas');
app.use('/api/cursos/programacion', routerProgramacion);
app.use('/api/cursos/matematicas', routerMatematicas);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
