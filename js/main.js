class Plan {
    constructor(id, nombre, precioBase, descripcion, ventajas) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.descripcion = descripcion;
        this.ventajas = ventajas ?? "Sin ventajas especificadas.";
    }
}

// Forzamos una clave nueva o limpiamos por código para evitar datos viejos
let listaDePlanes = JSON.parse(localStorage.getItem("planes_v2")) ?? [
    new Plan(1, "Plan Básico", 1200, "Ideal para emprendedores que recién empiezan.", "Incluye soporte por email, acceso a funciones esenciales y actualizaciones estándar."),
    new Plan(2, "Plan Intermedio", 2400, "Para negocios en crecimiento constante.", "Incluye soporte prioritario, herramientas avanzadas y reportes mensuales detallados."),
    new Plan(3, "Plan Premium", 4000, "Acceso total sin límites corporativos.", "Incluye soporte 24/7, asesoramiento personalizado y beneficios exclusivos.")
];

const contenedorPlanes = document.getElementById("contenedor-planes");
const formPlan = document.getElementById("form-plan");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputBuscar = document.getElementById("input-buscar");

let idEnEdicion = null;

function guardarYRenderizar() {
    localStorage.setItem("planes_v2", JSON.stringify(listaDePlanes));
    renderizarPlanes(listaDePlanes);
}

function renderizarPlanes(planesAgesionar) {
    if (!contenedorPlanes) return;
    contenedorPlanes.innerHTML = ``;

    if (planesAgesionar.length === 0) {
        contenedorPlanes.innerHTML = `<p>No hay planes disponibles para mostrar.</p>`;
        return;
    }

    planesAgesionar.forEach(plan => {
        const { id, nombre, precioBase, descripcion, ventajas } = plan;

        const tarjeta = document.createElement("div");
        tarjeta.className = `plan-card`;

        tarjeta.innerHTML = `
            <div class="plan-info">
                <h3>${nombre}</h3>
                <p class="plan-desc"><strong>Descripción:</strong> ${descripcion}</p>
                <p class="plan-ventajas"><strong>Ventajas:</strong> ${ventajas}</p>
                <p class="plan-precio"><strong>Precio oficial:</strong> $${precioBase}</p>
            </div>
            <div class="acciones-tarjeta">
                <button class="btn-edit">Modificar</button>
                <button class="btn-delete">Eliminar</button>
            </div>
        `;

        tarjeta.querySelector(".btn-delete").addEventListener("click", () => {
            eliminarPlan(id);
        });

        tarjeta.querySelector(".btn-edit").addEventListener("click", () => {
            cargarPlanParaEditar(id);
        });

        contenedorPlanes.appendChild(tarjeta);
    });
}

formPlan.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreVal = inputNombre.value.trim();
    const precioVal = parseFloat(inputPrecio.value);

    if (nombreVal === "" || isNaN(precioVal)) {
        return;
    }

    if (idEnEdicion !== null) {
        const planAEditar = listaDePlanes.find(p => p.id === idEnEdicion);
        if (planAEditar) {
            planAEditar.nombre = nombreVal;
            planAEditar.precioBase = precioVal;
        }
        idEnEdicion = null;
        formPlan.querySelector("button[type='submit']").textContent = `+ Agregar Plan`;
    } else {
        const nuevoId = listaDePlanes.length > 0 ? listaDePlanes[listaDePlanes.length - 1].id + 1 : 1;
        const nuevoPlan = new Plan(nuevoId, nombreVal, precioVal, "Plan personalizado adaptado por el usuario.", "Incluye configuración a medida sobre la base del catálogo oficial.");
        listaDePlanes.push(nuevoPlan);
    }

    guardarYRenderizar();
    formPlan.reset();
});

function eliminarPlan(id) {
    listaDePlanes = listaDePlanes.filter(p => p.id !== id);
    guardarYRenderizar();
}

function cargarPlanParaEditar(id) {
    const plan = listaDePlanes.find(p => p.id === id);
    if (plan) {
        inputNombre.value = plan.nombre;
        inputPrecio.value = plan.precioBase;
        idEnEdicion = plan.id;
        formPlan.querySelector("button[type='submit']").textContent = `Guardar Cambios`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

if (inputBuscar) {
    inputBuscar.addEventListener("input", (e) => {
        const textoBusqueda = e.target.value.toLowerCase();
        const planesFiltrados = listaDePlanes.filter(plan => {
            const { nombre } = plan;
            return nombre.toLowerCase().includes(textoBusqueda);
        });
        renderizarPlanes(planesFiltrados);
    });
}

renderizarPlanes(listaDePlanes);