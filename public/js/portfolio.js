// porfolio.js
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const resumeFtn = () => {
  window.location.href = "https://drive.google.com/file/d/1rSIp33_aiCkCnbWaymkcxjAPcbzzeOgg/view?usp=sharing";
}
