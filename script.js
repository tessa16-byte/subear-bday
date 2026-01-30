/* ---------------------------
   Screen navigation
---------------------------- */
const screens = {
  home: document.getElementById("screenHome"),
  letter: document.getElementById("screenLetter"),
  question: document.getElementById("screenQuestion"),
  end: document.getElementById("screenEnd"),
};

function showScreen(which) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[which].classList.add("active");
}

/* ---------------------------
   Floating hearts background
---------------------------- */
(() => {
  const layer = document.querySelector(".hearts-layer");
  if (!layer) return;

  const hearts = ["💙", "🫧", "✨", "💫"];
  const makeHeart = () => {
    const el = document.createElement("span");
    el.className = "heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 6;
    const drift = (Math.random() * 120 - 60).toFixed(0) + "px";
    const scale = (0.8 + Math.random() * 1.2).toFixed(2);

    el.style.left = left + "vw";
    el.style.animationDuration = duration + "s";
    el.style.setProperty("--drift", drift);
    el.style.setProperty("--scale", scale);

    layer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  };

  setInterval(makeHeart, 350);
})();

/* ---------------------------
   Music play/pause button
---------------------------- */
(() => {
  const btn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;

  let playing = false;

  const updateUI = () => {
    btn.textContent = playing ? "⏸" : "▶︎";
    btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    btn.title = playing ? "Pause music" : "Play music";
  };

  btn.addEventListener("click", async () => {
    try {
      if (!playing) {
        await audio.play();
        playing = true;
      } else {
        audio.pause();
        playing = false;
      }
      updateUI();
    } catch (e) {
      console.log("Music error:", e);
    }
  });

  updateUI();
})();

/* ---------------------------
   Typing animation
---------------------------- */
function typeTitle(el, speed = 55) {
  if (!el) return;

  const text = el.dataset.text || "";
  el.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "typed-cursor";
  cursor.textContent = "|";
  el.appendChild(cursor);

  let i = 0;
  const tick = () => {
    if (i < text.length) {
      cursor.insertAdjacentText("beforebegin", text[i]);
      i++;
      setTimeout(tick, speed);
    }
  };
  tick();
}

function resetTypedTitle() {
  const el = document.getElementById("typedTitle");
  if (!el) return;
  el.innerHTML = "";
}

/* ---------------------------
   Confetti
---------------------------- */
function confettiBurst() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 160 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.8) * 16,
    g: 0.35 + Math.random() * 0.25,
    size: 4 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    life: 90 + Math.random() * 50,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];

      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life / 140);
      ctx.fillStyle = "white";
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.life <= 0 || p.y > canvas.height + 60) pieces.splice(i, 1);
    }

    if (pieces.length > 0) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  draw();
}

/* ---------------------------
   Choices (YES/NO)
---------------------------- */
const yesOption = document.getElementById("yesOption");
const noOption = document.getElementById("noOption");
const choiceStatus = document.getElementById("choiceStatus");

function setStatus(text) {
  if (choiceStatus) choiceStatus.textContent = text;
}

if (yesOption && noOption) {
  yesOption.addEventListener("change", () => {
    if (yesOption.checked) {
      noOption.checked = false;
      setStatus("You chose YES 💙");
      confettiBurst();
    } else {
      setStatus("No choice yet.");
    }
  });

  noOption.addEventListener("change", () => {
    if (noOption.checked) {
      yesOption.checked = false;
      setStatus("You chose NO 🤍");
    } else {
      setStatus("No choice yet.");
    }
  });
}

/* ---------------------------
   Buttons navigation
---------------------------- */
document.getElementById("openLetterBtn")?.addEventListener("click", () => {
  showScreen("letter");
  resetTypedTitle();
  typeTitle(document.getElementById("typedTitle"), 50);
});

document.getElementById("backToHomeBtn")?.addEventListener("click", () => {
  showScreen("home");
});

document.getElementById("nextToQuestionBtn")?.addEventListener("click", () => {
  showScreen("question");
});

document.getElementById("backToLetterBtn")?.addEventListener("click", () => {
  showScreen("letter");
  resetTypedTitle();
  typeTitle(document.getElementById("typedTitle"), 50);
});

document.getElementById("finishBtn")?.addEventListener("click", () => {
  showScreen("end");
});

document.getElementById("restartBtn")?.addEventListener("click", () => {
  if (yesOption) yesOption.checked = false;
  if (noOption) noOption.checked = false;
  setStatus("No choice yet.");
  showScreen("home");
});
