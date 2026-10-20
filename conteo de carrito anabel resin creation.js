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

function formatoPrecio(precio) {
    return "RD$ " + precio.toLocaleString("es-DO", {
        maximumFractionDigits: 2
    });
}

// AGREGAR PRODUCTOS
botonesAgregar.forEach(function(boton) {
    boton.addEventListener("click", function() {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        if (!nombre || !Number.isFinite(precio) || precio <= 0) {
            mensaje.textContent = "Producto o precio no válido.";
            return;
        }

        const existente = carrito.find(function(producto) {
            return producto.nombre === nombre;
        });

        if (existente) {
            existente.cantidad++;
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

        document.querySelector(".seccion-carrito")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });
});

// CALCULAR TOTAL
function calcularTotal() {
    return carrito.reduce(function(suma, producto) {
        return suma + producto.precio * producto.cantidad;
    }, 0);
}

// MOSTRAR CARRITO
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

            const nombre = document.createElement("td");
            nombre.textContent = producto.nombre;

            const precio = document.createElement("td");
            precio.textContent = formatoPrecio(producto.precio);

            const cantidad = document.createElement("td");
            cantidad.textContent = producto.cantidad;

            const subtotal = document.createElement("td");
            subtotal.textContent = formatoPrecio(
                producto.precio * producto.cantidad
            );

            const acciones = document.createElement("td");
            const eliminar = document.createElement("button");

            eliminar.type = "button";
            eliminar.textContent = "Eliminar";

            eliminar.addEventListener("click", function() {
                carrito.splice(indice, 1);
                resumen.hidden = true;
                mensaje.textContent = "Producto eliminado.";
                actualizarCarrito();
            });

            acciones.appendChild(eliminar);

            fila.append(
                nombre,
                precio,
                cantidad,
                subtotal,
                acciones
            );

            listaCarrito.appendChild(fila);
        });
    }

    totalElemento.textContent = formatoPrecio(calcularTotal());
    totalResumen.textContent = formatoPrecio(calcularTotal());
}

// MOSTRAR RESUMEN
botonPagar.addEventListener("click", function() {
    if (carrito.length === 0) {
        mensaje.textContent = "Agrega productos antes de pagar.";
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

    mensaje.textContent = "Revisa el resumen de tu compra.";

    resumen.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// VACIAR CARRITO
botonVaciar.addEventListener("click", function() {
    carrito = [];

    actualizarCarrito();
    resumen.hidden = true;

    mensaje.textContent = "El carrito se ha vaciado.";
});

// COMPLETAR COMPRA Y ENVIAR PEDIDO A PHP
botonCompletar.addEventListener("click", async function() {
    if (carrito.length === 0) {
        mensaje.textContent = "Agrega productos antes de continuar.";
        return;
    }

    botonCompletar.disabled = true;

    try {
        const respuesta = await fetch("guardar_pedidos.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productos: carrito.map(function(producto) {
                    return {
                        nombre: producto.nombre,
                        cantidad: producto.cantidad
                    };
                })
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.exito) {
            mensaje.textContent =
                resultado.mensaje || "No se pudo guardar el pedido.";
            return;
        }

        // Guardar solo el identificador del pedido para el siguiente paso.
        sessionStorage.setItem("idPedido", resultado.id_pedido);

        window.location.href = "pago.php";

    } catch (error) {
        mensaje.textContent =
            "No se pudo conectar con el servidor PHP.";
    } finally {
        botonCompletar.disabled = false;
    }
});

// INICIAR
actualizarCarrito();