function playClickSFX() {
    const sound = new Audio('sounds/play-button-sfx.mp3');
    sound.volume = 0.3;
    sound.playbackRate = 0.95 + Math.random() * 0.1;
    sound.play();
}

const playBtn = document.getElementById("playBtn");
const subMenu = document.getElementById("subMenu");

playBtn.addEventListener("click", (e) => {
  e.preventDefault();
  subMenu.classList.toggle("open");
});
