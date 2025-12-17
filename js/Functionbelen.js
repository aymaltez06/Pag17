
const facts = [
  "Las jirafas tienen el corazón más grande entre los animales terrestres 💖",
  "Duermen muy poco, pero siempre están atentas 💤",
  "Cada mancha es única, como tú ✨",
  "Son tranquilas, dulces y fuertes a la vez 🦒"
];

const btn = document.getElementById("giraffeBtn");
const panel = document.getElementById("giraffePanel");
const fact = document.getElementById("giraffeFact");

btn.addEventListener("click", () => {
  panel.classList.toggle("hidden");

  const random = facts[Math.floor(Math.random() * facts.length)];
  fact.textContent = random;
});

