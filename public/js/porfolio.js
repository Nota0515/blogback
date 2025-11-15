// porfolio.js
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const resumeFtn = () => {
  window.location.href = "https://drive.google.com/file/d/1Ueu3HNhHB5nY4M9GOLg2yz5F2Hh_bE1m/view?usp=sharing";
}
