const express = require('express');
const { infoCursos } = require('../datos/cursos.js');

const routerMatematicas = express.Router();

routerMatematicas.use(express.json());

routerMatematicas.get('/', (req, res) => {
    res.json(infoCursos.matematicas);
});

routerMatematicas.get('/:tema', (req, res) => {
    const tema = req.params.tema;

    const data = infoCursos.matematicas.filter(curso => curso.tema === tema);

    if (data.length === 0) {
        return res.status(404).send(`No se encontraron cursos de ${tema}`);
    }

    res.json(data);
});

routerMatematicas.get('/:tema/:nivel', (req, res) => {
    const { tema, nivel } = req.params;

    const data = infoCursos.matematicas.filter(curso =>
        curso.tema === tema && curso.nivel === nivel
    );

    if (data.length === 0) {
        return res.status(404).send(`No se encontró el tema ${tema} con nivel ${nivel}`);
    }

    res.json(data);
});

module.exports = routerMatematicas;
