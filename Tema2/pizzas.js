function simularExito() {
    return Math.random() < 0.5; 
}

function realizarPedido() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (simularExito()) {
                resolve("El pedido fue exitoso: ¡Tu pizza está en camino!");
            } else {
                reject("El pedido falló: Problemas de red o saturación.");
            }
        }, 3000);
    });
}

function manejarExito(mensaje) {
    console.log(mensaje);
}

function manejarError(error) {
    console.error(error);
}

realizarPedido()
    .then(manejarExito)
    .catch(manejarError);
