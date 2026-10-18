
const botonesAgregar = document.querySelectorAll(".carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

const botonPagar = document.getElementById("pagar");
const botonVaciar = document.getElementById("vaciar");
const botonCompletar = document.getElementById("completar");

const resumen = document.getElementById("resumen");
const detalleResumen = document.getElementById("detalle-resumen");
const totalResumen = document.getElementById("total-resumen");

let carrito = [];

// FORMATEAR PRECIOS EN PESOS DOMINICANOS

function formatoPrecio(precio) {
    return "RD$ " + precio.toLocaleString("es-DO", {
        maximumFractionDigits: 0
    });
}

// AGREGAR PRODUCTOS AL CARRITO

botonesAgregar.forEach(function(boton) {
    boton.addEventListener("click", function() {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        const productoExistente = carrito.find(function(producto) {
            return producto.nombre === nombre;
        });

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        mensaje.textContent = nombre + " agregado al carrito.";

        resumen.hidden = true;
        actualizarCarrito();

        // Llevar al usuario a la sección del carrito
        document.querySelector(".seccion-carrito")
            .scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// SUMAR LOS PRECIOS DE TODOS LOS PRODUCTOS

function calcularTotal() {
    let suma = 0;

    carrito.forEach(function(producto) {
        suma += producto.precio * producto.cantidad;
    });

    return suma;
}

// MOSTRAR PRODUCTOS Y ACTUALIZAR EL TOTAL

function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Tu carrito está vacío.";

        fila.appendChild(celda);
        listaCarrito.appendChild(fila);
    } else {
        carrito.forEach(function(producto, indice) {
            const fila = document.createElement("tr");

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = producto.nombre;

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = formatoPrecio(producto.precio);

            const celdaCantidad = document.createElement("td");
            celdaCantidad.textContent = producto.cantidad;

            const celdaSubtotal = document.createElement("td");
            celdaSubtotal.textContent = formatoPrecio(
                producto.precio * producto.cantidad
            );

            const celdaAccion = document.createElement("td");
            const botonEliminar = document.createElement("button");

            botonEliminar.type = "button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "carrito";

            botonEliminar.addEventListener("click", function() {
                carrito.splice(indice, 1);

                mensaje.textContent =
                    "Producto eliminado del carrito.";

                resumen.hidden = true;
                actualizarCarrito();
            });

            celdaAccion.appendChild(botonEliminar);

            fila.append(
                celdaNombre,
                celdaPrecio,
                celdaCantidad,
                celdaSubtotal,
                celdaAccion
            );

            listaCarrito.appendChild(fila);
        });
    }

    // Actualizar la sumatoria
    totalElemento.textContent = formatoPrecio(calcularTotal());
    totalResumen.textContent = formatoPrecio(calcularTotal());
}

// BOTON PAGAR: MOSTRAR EL RESUMEN DE LA COMPRA

botonPagar.addEventListener("click", function() {
    if (carrito.length === 0) {
        mensaje.textContent =
            "Agrega productos antes de realizar el pago.";

        resumen.hidden = true;
        return;
    }

    detalleResumen.innerHTML = "";

    carrito.forEach(function(producto) {
        const linea = document.createElement("p");

        linea.textContent =
            producto.nombre +
            " | Cantidad: " + producto.cantidad +
            " | Subtotal: " +
            formatoPrecio(producto.precio * producto.cantidad);

        detalleResumen.appendChild(linea);
    });

    totalResumen.textContent = formatoPrecio(calcularTotal());

    resumen.hidden = false;

    mensaje.textContent =
        "Revisa el resumen de tu compra antes de continuar.";

    resumen.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// BOTON VACIAR CARRITO

botonVaciar.addEventListener("click", function() {
    if (carrito.length === 0) {
        mensaje.textContent = "El carrito ya está vacío.";
        return;
    }

    carrito = [];

    actualizarCarrito();
    resumen.hidden = true;

    mensaje.textContent =
        "El carrito se ha vaciado correctamente.";
});


// BOTON COMPLETAR PAGO

botonCompletar.addEventListener("click", function() {

    if (carrito.length === 0) {
        mensaje.textContent =
            "Agrega productos antes de completar el pago.";
        return;
    }

    const totalCompra = calcularTotal();

    localStorage.setItem("totalCompra", totalCompra);

    window.location.href = "formulario wanda castro.html";

});



// INICIAR EL CARRITO VACÍO

actualizarCarrito();
