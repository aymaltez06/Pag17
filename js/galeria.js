const images = [
  "img/1.jpg",
  "img/2.jpg",
  "img/3.jpg",
  "img/4.jpg",
  "img/5.jpg",
  "img/6.jpg"
];

let index = 0;

function setImages(start) {
  document.getElementById("big1").style.opacity = 0;
  document.getElementById("big2").style.opacity = 0;
  document.getElementById("big3").style.opacity = 0;
  document.getElementById("big4").style.opacity = 0;

  setTimeout(() => {
    document.getElementById("big1").src = images[start % images.length];
    document.getElementById("big2").src = images[(start + 1) % images.length];
    document.getElementById("big3").src = images[(start + 2) % images.length];
    document.getElementById("big4").src = images[(start + 3) % images.length];

    document.getElementById("big1").style.opacity = 1;
    document.getElementById("big2").style.opacity = 1;
    document.getElementById("big3").style.opacity = 1;
    document.getElementById("big4").style.opacity = 1;
  }, 300);
}

// Cambio automático
setInterval(() => {
  setImages(index);
  index = (index + 1) % images.length;
}, 4000);
