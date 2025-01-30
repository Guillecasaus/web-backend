const http = require('http'); // Importar el módulo HTTP

const port = 3000; // Puerto donde escuchará el servidor

// Crear el servidor
const servidor = http.createServer((req, res) => {
    // Mostrar información sobre la solicitud en la consola
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);

    // Configurar la respuesta según la URL y el método
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('¡Bienvenido al servidor con Node.js!');
    } else if (req.url === '/' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('¡Solicitud POST recibida!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

// Iniciar el servidor
servidor.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
