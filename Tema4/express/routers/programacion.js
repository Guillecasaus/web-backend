const express = require('express');
const { infoCursos } = require('../datos/cursos.js');

const routerProgramacion = express.Router();

routerProgramacion.use(express.json());

routerProgramacion.get('/', (req, res) => {
    res.json(infoCursos.programacion);
});

routerProgramacion.get('/:lenguaje', (req, res) => {
    const lenguaje = req.params.lenguaje;

    const data = infoCursos.programacion.filter(curso => curso.lenguaje === lenguaje);

    if (data.length === 0) {
        return res.status(404).send(`No se encontraron cursos de ${lenguaje}`);
    }

    res.json(data);
});

// Ruta con lenguaje y nivel
routerProgramacion.get('/:lenguaje/:nivel', (req, res) => {
    const { lenguaje, nivel } = req.params;

    const data = infoCursos.programacion.filter(curso =>
        curso.lenguaje === lenguaje && curso.nivel === nivel
    );

    if (data.length === 0) {
        return res.status(404).send(`No se encontró el lenguaje ${lenguaje} con nivel ${nivel}`);
    }

    res.json(data);
});

module.exports = routerProgramacion;
