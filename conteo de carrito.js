Conteo carrito         // === VARIABLES DEL CARRITO ===
let carrito = [];       // Almacena los productos
let total = 0;          // Suma de todos los precios

// === AGREGAR PRODUCTO ===
function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    total += precio;  // Suma automática
    actualizarCarrito();
}

// === QUITAR PRODUCTO ===
function quitarDelCarrito(indice) {
    if (carrito[indice]) {
        total -= carrito[indice].precio;  // Resta al eliminar
        carrito.splice(indice, 1);
        actualizarCarrito();
    }
}

// === VACIAR CARRITO ===
function vaciarCarrito() {
    carrito = [];
    total = 0;
    actualizarCarrito();
    document.getElementById('mensaje-pago').style.display = 'none';
}

// === PROCESAR PAGO ===
function procesarPago() {
    if (carrito.length === 0) return;
    
    // Mostrar mensaje de confirmación
    const mensaje = document.getElementById('mensaje-pago');
    mensaje.style.display = 'block';
    
    // Aquí puedes agregar la lógica de pago real
    alert(`¡Gracias por tu compra!\nTotal a pagar: $${total.toFixed(2)}\n\nProcesando pago... 💳`);
    
    // Vaciar el carrito después del pago
    setTimeout(() => {
        vaciarCarrito();
    }, 2000);
}

// === ACTUALIZAR VISTA ===
function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const elementoTotal = document.getElementById('total');
    const elementoCantidad = document.getElementById('cantidad-articulos');
    const botonPagar = document.getElementById('boton-pagar');

    // Habilitar o deshabilitar botón de pagar
    botonPagar.disabled = carrito.length === 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
        lista.innerHTML = '';
        carrito.forEach((item, indice) => {
            lista.innerHTML += `
                <div class="item-carrito">
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="precio-item">$${item.precio.toFixed(2)}</span>
                    <button class="boton-quitar" onclick="quitarDelCarrito(${indice})">✕ Quitar</button>
                </div>
            `;
        });
    }

    // Mostrar cantidad y suma total
    elementoCantidad.textContent = carrito.length;
    elementoTotal.textContent = total.toFixed(2);
}