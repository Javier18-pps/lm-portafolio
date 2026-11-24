// ===== alta.js · Validación a medida del alta de usuario en la red del centro =====

const nacimiento = document.getElementById('nacimiento');
const clave = document.getElementById('clave');
const clave2 = document.getElementById('clave2');
const EDAD_MINIMA = 16;

// El máximo del calendario es hoy (no se puede nacer en el futuro)
const hoy = new Date();
nacimiento.max = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

// Calcula la edad cumplida a partir de una fecha aaaa-mm-dd
function calcularEdad(valor) {
  const [a, m, d] = valor.split('-').map(Number);
  let edad = hoy.getFullYear() - a;
  // si este año todavía no ha cumplido, se resta uno
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) {
    edad--;
  }
  return edad;
}

// Regla a medida 1: edad mínima de 16 años
function comprobarEdad() {
  nacimiento.setCustomValidity('');
  if (!nacimiento.value) return;
  if (calcularEdad(nacimiento.value) < EDAD_MINIMA) {
    nacimiento.setCustomValidity(`Debes tener al menos ${EDAD_MINIMA} años para darte de alta.`);
  }
}
nacimiento.addEventListener('input', comprobarEdad);
nacimiento.addEventListener('change', comprobarEdad);

// Regla a medida 2: las contraseñas coinciden
function comprobarClaves() {
  clave2.setCustomValidity(
    clave2.value && clave2.value !== clave.value ? 'Las contraseñas no coinciden.' : ''
  );
}
clave.addEventListener('input', comprobarClaves);
clave2.addEventListener('input', comprobarClaves);
