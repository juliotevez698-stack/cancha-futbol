// Los datos viven acá adentro: no hay servidor ni base de datos.
const HORARIOS = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00"];
const PRECIO_HORA = 25000;

// Cada reserva guarda el nombre del equipo, por horario.
const reservas = {};

// Da formato de pesos: 1234.5 -> "$ 1.234,50"
function pesos(numero) {
  return "$ " + numero.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function reservar(hora) {
  const respuesta = prompt("¿Cómo se llama el equipo que reserva las " + hora + "?");
  if (respuesta === null) return;          // apretó Cancelar
  const equipo = respuesta.trim();
  if (equipo === "") return;               // dejó el campo vacío
  reservas[hora] = equipo;
  dibujar();
}

function liberar(hora) {
  delete reservas[hora];
  dibujar();
}

function dibujar() {
  const grilla = document.getElementById("grilla");
  grilla.innerHTML = "";

  HORARIOS.forEach(function (hora) {
    const equipo = reservas[hora];
    const ocupada = Boolean(equipo);

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta " + (ocupada ? "ocupada" : "libre");

    const titulo = document.createElement("h2");
    titulo.textContent = hora;
    tarjeta.appendChild(titulo);

    const estado = document.createElement("p");
    estado.className = "estado";
    estado.textContent = ocupada ? "Ocupada" : "Libre";
    tarjeta.appendChild(estado);

    if (ocupada) {
      const nombre = document.createElement("p");
      nombre.className = "equipo";
      nombre.textContent = equipo;
      tarjeta.appendChild(nombre);
    }

    const boton = document.createElement("button");
    boton.textContent = ocupada ? "Liberar" : "Reservar";
    boton.addEventListener("click", function () {
      if (ocupada) {
        liberar(hora);
      } else {
        reservar(hora);
      }
    });
    tarjeta.appendChild(boton);

    grilla.appendChild(tarjeta);
  });

  actualizarResumen();
}

function actualizarResumen() {
  const ocupadas = Object.keys(reservas).length;
  document.getElementById("ocupadas").textContent = ocupadas;
  document.getElementById("libres").textContent = HORARIOS.length - ocupadas;
  document.getElementById("recaudado").textContent = pesos(ocupadas * PRECIO_HORA);
}

function cerrarDia() {
  const ocupadas = Object.keys(reservas).length;
  const resultado = document.getElementById("resultado-dia");

  if (ocupadas === 0) {
    resultado.textContent = "Todavía no hay reservas para cerrar.";
    return;
  }

  const total = ocupadas * PRECIO_HORA;
  resultado.textContent =
    "Día cerrado: " + ocupadas + " hora" + (ocupadas === 1 ? "" : "s") +
    " alquilada" + (ocupadas === 1 ? "" : "s") + ", " + pesos(total) + " recaudados.";

  Object.keys(reservas).forEach(function (hora) {
    delete reservas[hora];
  });
  dibujar();
}

document.getElementById("cerrar-dia").addEventListener("click", cerrarDia);

dibujar();
