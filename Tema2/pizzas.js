// Simular función con 80% de éxito
function simularExito() {
    return Math.random() < 0.5; // Devuelve true el 80% de las veces
}

// Crear una Promesa que simula asincronía con setTimeout de 3000ms
function realizarPedido() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (simularExito()) {
                resolve("El pedido fue exitoso: ¡Tu pizza está en camino! 🍕");
            } else {
                reject("El pedido falló: Problemas de red o saturación. 😢");
            }
        }, 3000);
    });
}

// Definir funciones para manejar éxito o fracaso
function manejarExito(mensaje) {
    console.log(mensaje);
}

function manejarError(error) {
    console.error(error);
}

// Asociar las funciones a la Promesa con .then() y .catch()
realizarPedido()
    .then(manejarExito)
    .catch(manejarError);
