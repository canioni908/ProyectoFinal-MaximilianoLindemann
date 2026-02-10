// ELEMENTOS DEL DOM
const contenedorAutos = document.getElementById('contenedor-autos');
const carritoContenedor = document.getElementById('carrito');
const totalSpan = document.getElementById('total');
const btnComprar = document.getElementById('btn-comprar');
const buscadorInput = document.getElementById('buscador');

const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const direccionInput = document.getElementById('direccion');

// DATOS
let autos = [];
let carrito = [];

// PRECARGA FORMULARIO
nombreInput.value = 'Juan Pérez';
emailInput.value = 'juan@email.com';
direccionInput.value = 'Av. Siempre Viva 123';

// CARGAR CARRITO GUARDADO
const carritoGuardado = JSON.parse(localStorage.getItem('carritoAutos'));
if (carritoGuardado) {
    carrito = carritoGuardado;
}

// FETCH AUTOS
fetch('data/autos.json')
    .then(response => response.json())
    .then(data => {
        autos = data;
        mostrarAutos(autos);
        actualizarCarrito();
    });

// BUSCADOR
buscadorInput.addEventListener('input', () => {
    const texto = buscadorInput.value.toLowerCase();

    const autosFiltrados = autos.filter(auto =>
        auto.marca.toLowerCase().includes(texto) ||
        auto.modelo.toLowerCase().includes(texto)
    );

    mostrarAutos(autosFiltrados);
});

// MOSTRAR AUTOS
function mostrarAutos(listaAutos) {
    contenedorAutos.innerHTML = '';

    listaAutos.forEach(auto => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        col.innerHTML = `
    <div class="card h-100">
        <img src="${auto.imagen}" class="card-img-top" alt="${auto.marca}">
        <div class="card-body">
            <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
            <p class="card-text">Precio: $${auto.precio.toLocaleString()}</p>
            <button class="btn btn-danger w-100" onclick="agregarAlCarrito(${auto.id})">
                Agregar al carrito
            </button>
        </div>
    </div>
`;


        contenedorAutos.appendChild(col);
    });
}

// AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    const autoSeleccionado = autos.find(auto => auto.id === id);
    const autoEnCarrito = carrito.find(auto => auto.id === id);

    if (autoEnCarrito) {
        autoEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...autoSeleccionado,
            cantidad: 1
        });
    }

    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: `${autoSeleccionado.marca} ${autoSeleccionado.modelo}`,
        timer: 1200,
        showConfirmButton: false
    });
}

// ACTUALIZAR CARRITO
function actualizarCarrito() {
    carritoContenedor.innerHTML = '';

    carrito.forEach(auto => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center mb-2';

        div.innerHTML = `
            <div>
                <strong>${auto.marca} ${auto.modelo}</strong>
                <p>Cantidad: ${auto.cantidad}</p>
            </div>
            <div class="text-end">
                <p>$${(auto.precio * auto.cantidad).toLocaleString()}</p>
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${auto.id})">
                    Eliminar
                </button>
            </div>
        `;

        carritoContenedor.appendChild(div);
    });

    calcularTotal();
    localStorage.setItem('carritoAutos', JSON.stringify(carrito));
}

// ELIMINAR DEL CARRITO
function eliminarDelCarrito(id) {
    carrito = carrito.filter(auto => auto.id !== id);
    actualizarCarrito();
}

// CALCULAR TOTAL
function calcularTotal() {
    let total = 0;

    carrito.forEach(auto => {
        total += auto.precio * auto.cantidad;
    });

    totalSpan.textContent = total.toLocaleString();
}

// CONFIRMAR COMPRA
btnComprar.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agregá al menos un auto para continuar'
        });
        return;
    }

    Swal.fire({
        title: '¿Confirmar compra?',
        text: 'Esta acción simula la compra del vehículo',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            if (
                nombreInput.value === '' ||
                emailInput.value === '' ||
                direccionInput.value === ''
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos incompletos',
                    text: 'Completá todos los campos'
                });
                return;
            }

            finalizarCompra();
        }
    });
});

// FINALIZAR COMPRA
function finalizarCompra() {
    carrito = [];
    localStorage.removeItem('carritoAutos');
    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: `Gracias por su compra, ${nombreInput.value}`
    });
}
