const express = require('express');
const { config } = require('dotenv');
const { infoCursos } = require('./cursos.js');

const app = express();

config();

app.get('/api/cursos/programacion/:lenguaje', (req, res) => {
    const lenguaje = req.params.lenguaje;

    const data = infoCursos.programacion.filter(curso => curso.lenguaje === lenguaje);

    if (data.length === 0) {
        return res.status(404).send("No se encontró " + lenguaje);
    }

    if (req.query.ordenar === 'vistas') {
        // Ordenar por vistas en orden descendente y enviar respuesta
        return res.send(JSON.stringify(data.sort((a, b) => b.vistas - a.vistas)));
    }

    // Enviar los datos sin ordenar
    res.send(JSON.stringify(data));
});


app.get('/api/cursos/matematicas/:tema', (req, res) => {
    const tema = req.params.tema;

    const data = infoCursos.matematicas.filter(curso => curso.tema === tema);

    if (data.length === 0) {
        return res.status(404).send(`No se encontró el tema ${tema}`);
    }

    res.json(data);
});

app.get('/api/cursos/programacion/:lenguaje/:nivel', (req, res) => {
    const { lenguaje, nivel } = req.params;

    const data = infoCursos.programacion.filter(curso =>
        curso.lenguaje === lenguaje && curso.nivel === nivel
    );

    if (data.length === 0) {
        return res.status(404).send(`No se encontró el lenguaje ${lenguaje} con nivel ${nivel}`);
    }

    res.json(data);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});


