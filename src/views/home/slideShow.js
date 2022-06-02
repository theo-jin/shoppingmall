const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slides li");
let cnt = 0;
let Timer = setInterval(function () {
  let from = -(800 * cnt);
  let to = from - 800;
  slides.animate(
    {
      marginLeft: [from + "px", to + "px"],
    },
    { duration: 1000, easing: "ease-in-out", iterations: 1, fill: "both" }
  );
  cnt++;
  if (cnt === slide.length - 1) {
    cnt = 0;
  }
}, 7000);
