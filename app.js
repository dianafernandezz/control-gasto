// Arreglo global para almacenar los movimientos en memoria del navegador
let transacciones = [];

// Captura de elementos del DOM (Document Object Model)
const formGasto = document.getElementById('formGasto');
const tablaCuerpo = document.getElementById('tablaCuerpo');
const lblIngresos = document.getElementById('lblIngresos');
const lblEgresos = document.getElementById('lblEgresos');
const lblSaldo = document.getElementById('lblSaldo');
const cardSaldo = document.getElementById('cardSaldo');

// Evento para escuchar cuando se envía el formulario
formGasto.addEventListener('submit', function(event) {
    event.preventDefault(); // Detiene la recarga automática de la página

    // Capturar los valores ingresados por el usuario
    const descripcion = document.getElementById('txtDescripcion').value;
    // Usamos parseInt para manejar números enteros (Moneda Guaraní sin decimales)
    const monto = parseInt(document.getElementById('txtMonto').value);
    const tipo = document.getElementById('cmbTipo').value;
    const categoria = document.getElementById('cmbCategoria').value;

    // Crear un objeto con los datos y guardarlo en la lista
    const nuevaTransaccion = { descripcion, monto, tipo, categoria };
    transacciones.push(nuevaTransaccion);

    // Actualizar la interfaz gráfica de la aplicación
    actualizarTabla();
    actualizarResumen();

    // Limpiar los campos del formulario para un nuevo registro
    formGasto.reset();
});

// Función para renderizar las filas en la tabla del historial
function actualizarTabla() {
    tablaCuerpo.innerHTML = ''; // Vaciar la tabla para evitar duplicaciones

    transacciones.forEach(t => {
        const fila = document.createElement('tr');

        // Construir la estructura de la fila con interpolación de cadenas
        // .toFixed(0) remueve los decimales por completo de los guaraníes
        fila.innerHTML = `
            <td>${t.descripcion}</td>
            <td><span class="badge bg-secondary">${t.categoria}</span></td>
            <td><span class="badge ${t.tipo === 'INGRESO' ? 'bg-success' : 'bg-danger'}">${t.tipo}</span></td>
            <td class="text-end fw-bold ${t.tipo === 'INGRESO' ? 'text-success' : 'text-danger'}">
                ${t.tipo === 'EGRESO' ? '-' : '+'} Gs. ${t.monto.toFixed(0)}
            </td>
        `;
        tablaCuerpo.appendChild(fila);
    });
}

// Función matemática para calcular los totales de los paneles
function actualizarResumen() {
    let ingresos = 0;
    let egresos = 0;

    // Sumar montos según correspondan a Ingresos o Egresos
    transacciones.forEach(t => {
        if (t.tipo === 'INGRESO') ingresos += t.monto;
        else egresos += t.monto;
    });

    const saldo = ingresos - egresos;

    // Inyectar los textos calculados en las tarjetas de Bootstrap
    lblIngresos.textContent = `Gs. ${ingresos.toFixed(0)}`;
    lblEgresos.textContent = `Gs. ${egresos.toFixed(0)}`;
    lblSaldo.textContent = `Gs. ${saldo.toFixed(0)}`;

    // Lógica visual: Si el saldo es negativo la tarjeta se vuelve roja
    if (saldo < 0) {
        cardSaldo.className = "card bg-danger text-white border-danger h-100";
    } else {
        cardSaldo.className = "card bg-primary-subtle text-primary border-primary h-100";
    }
}