const express = require('express');
const { infoCursos } = require('../datos/cursos.js');

const routerMatematicas = express.Router();

// Middleware específico para JSON
routerMatematicas.use(express.json());

// Ruta principal de matemáticas
routerMatematicas.get('/', (req, res) => {
    res.json(infoCursos.matematicas);
});

// Ruta con parámetro dinámico (tema)
routerMatematicas.get('/:tema', (req, res) => {
    const tema = req.params.tema;

    const data = infoCursos.matematicas.filter(curso => curso.tema === tema);

    if (data.length === 0) {
        return res.status(404).send(`No se encontraron cursos de ${tema}`);
    }

    res.json(data);
});

// Ruta con tema y nivel
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
