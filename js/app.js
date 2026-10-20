const hoy = new Date();
document.getElementById("fecha").textContent =
  "Hoy es " + hoy.toLocaleDateString("es-ES");
