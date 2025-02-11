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

routerProgramacion.post('/', (req, res) => {
    const cursoNuevo = req.body;

    if (!cursoNuevo.id || !cursoNuevo.titulo || !cursoNuevo.lenguaje || !cursoNuevo.vistas || !cursoNuevo.nivel) {
        return res.status(400).send('El curso no tiene el formato adecuado');
    }

    infoCursos.programacion.push(cursoNuevo);

    res.status(201).json(infoCursos.programacion); 
});

routerProgramacion.put('/:id', (req, res) => {
    const cursoActualizado = req.body;
    const id = req.params.id;
    const indice = programacion.findIndex(curso => curso.id == id);
    
    if (indice >= 0) {
        programacion[indice] = cursoActualizado;
    }
    
    res.send(JSON.stringify(programacion));
   
});

routerProgramacion.delete('/:id', (req, res) => {
    const id = req.params.id;
    const indice = programacion.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        infoCursos.programacion.splice(indice, 1);
    }
    
    res.send(JSON.stringify(programacion));
  
});
   
module.exports = routerProgramacion;
