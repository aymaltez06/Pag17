const counterText = document.getElementById("counter-text");

function calcularDias() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  let proximo17 = new Date(año, mes, 17);

  // Si ya pasó el 17, vamos al siguiente mes
  if (hoy.getDate() > 17) {
    proximo17 = new Date(año, mes + 1, 17);
  }

  // Normalizamos horas para evitar errores
  hoy.setHours(0, 0, 0, 0);
  proximo17.setHours(0, 0, 0, 0);

  const diferencia = proximo17 - hoy;
  const dias = Math.round(diferencia / (1000 * 60 * 60 * 24));

  // 🧠 Lógica del mensaje
  if (dias === 0) {
    counterText.textContent = "Es hoy nuestro mes 7 ❤️";
  } else if (dias === 1) {
    counterText.textContent = "Falta 1 día para nuestro próximo mes 💕";
  } else {
    counterText.textContent = `Faltan ${dias} días para nuestro próximo mes 💖`;
  }
}

calcularDias();

