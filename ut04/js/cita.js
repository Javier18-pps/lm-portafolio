// ===== cita.js · Validación a medida del formulario de cita (BiciRuta, UT4) =====
// Se carga con defer, así que cuando se ejecuta el HTML ya existe.

const fecha = document.getElementById('fecha');
const crearCuenta = document.getElementById('crear-cuenta');
const cuenta = document.getElementById('cuenta');
const clave = document.getElementById('clave');
const clave2 = document.getElementById('clave2');
const averia = document.getElementById('averia');
const contador = document.getElementById('contador');
const dni = document.getElementById('dni');

// Convierte un Date al formato aaaa-mm-dd que usa <input type="date">,
// con la fecha local (toISOString() usaría UTC y podría dar el día anterior).
function aFormatoFecha(d) {
  const a = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${a}-${m}-${dia}`;
}

// ---------- Regla 1 · Fecha mínima: mañana ----------
const manana = new Date();
manana.setDate(manana.getDate() + 1);
fecha.min = aFormatoFecha(manana);
// Si eligen una fecha anterior, el propio navegador muestra su mensaje (rangeUnderflow).

// ---------- Regla 2 · Domingos cerrados ----------
function comprobarDomingo() {
  fecha.setCustomValidity('');               // limpiar el error anterior
  if (!fecha.value) return;                  // vacío: ya lo controla required
  const [a, m, d] = fecha.value.split('-').map(Number);
  const dia = new Date(a, m - 1, d).getDay(); // fecha local; 0 = domingo
  if (dia === 0) {
    fecha.setCustomValidity('El taller cierra los domingos.');
  }
}
fecha.addEventListener('input', comprobarDomingo);
fecha.addEventListener('change', comprobarDomingo);

// ---------- Regla 3 · Cuenta opcional ----------
crearCuenta.addEventListener('change', () => {
  cuenta.disabled = !crearCuenta.checked;    // disabled: ni se valida ni se envía
  if (crearCuenta.checked) {
    clave.focus();                           // el foco va a la contraseña
  } else {
    clave.value = '';
    clave2.value = '';
    clave2.setCustomValidity('');
  }
});

// ---------- Regla 4 · Las contraseñas deben coincidir ----------
// (el mínimo de 8 caracteres con letras y números lo controla el pattern del HTML)
function comprobarClaves() {
  clave2.setCustomValidity(
    clave2.value && clave2.value !== clave.value ? 'Las contraseñas no coinciden.' : ''
  );
}
clave.addEventListener('input', comprobarClaves);
clave2.addEventListener('input', comprobarClaves);

// ---------- Contador de caracteres de la avería ----------
function actualizarContador() {
  contador.textContent = `${averia.value.length} / 500 caracteres`;
}
averia.addEventListener('input', actualizarContador);
document.getElementById('form-cita').addEventListener('reset', () => {
  setTimeout(actualizarContador, 0);         // tras borrar, el contador vuelve a 0
});

// ---------- Ampliación · Letra del DNI ----------
// El pattern solo comprueba el formato (8 cifras + letra). Que la letra sea la correcta
// es un cálculo (número % 23 en la tabla oficial), y eso solo se puede hacer con script.
const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';
function comprobarLetraDni() {
  dni.setCustomValidity('');
  if (!/^[0-9]{8}[A-Za-z]$/.test(dni.value)) return; // el formato lo valida el pattern
  const numero = Number(dni.value.slice(0, 8));
  const letra = dni.value.slice(8).toUpperCase();
  if (LETRAS_DNI[numero % 23] !== letra) {
    dni.setCustomValidity(`La letra del DNI no es correcta (debería ser ${LETRAS_DNI[numero % 23]}).`);
  }
}
dni.addEventListener('input', comprobarLetraDni);
