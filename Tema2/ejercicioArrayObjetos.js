let products = [
    {
        nombre: "PC-Gaming",
        marca: "Asus",
        precio: 1200
    },
    {
        nombre: "Tablet",
        marca: "Samsung",
        precio: 300
    },
    {
        nombre: "Cámara-Reflex",
        marca: "Canon",
        precio: 650
    }
];

function getProducts() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(products);
        }, 3000); 
    });
}

getProducts()
    .then((productos) => {
        console.log("Productos obtenidos con .then():", productos);
    })
    .catch((error) => {
        console.error("Error al obtener productos con .then():", error);
    });

async function obtenerProductos() {
    try {
        const productos = await getProducts();
        console.log("Productos obtenidos con await:", productos);
    } catch (error) {
        console.error("Error al obtener productos con await:", error);
    }
}

obtenerProductos();
