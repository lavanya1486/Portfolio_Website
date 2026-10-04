/* =========================================================
   Lavanya Pandit Portfolio
   Main JavaScript
   ========================================================= */

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* ---------------------------------------------------------
   3D hero scene
   --------------------------------------------------------- */

const scene = $(".scene");
const floatingCards = $$(".floating-card");

if (!prefersReducedMotion && scene) {
  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / innerWidth - 0.5) * 18;
    const y = (event.clientY / innerHeight - 0.5) * 18;

    scene.style.transform =
      `rotateX(${-y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;

    floatingCards.forEach((card, index) => {
      const direction = index ? -1 : 1;
      const z = index ? 80 : 55;

      card.style.transform =
        `rotateX(${(-y * .85).toFixed(2)}deg) ` +
        `rotateY(${(x * direction * 1.2).toFixed(2)}deg) ` +
        `translateZ(${z}px)`;
    });
  });
}

/* ---------------------------------------------------------
   Particle field
   --------------------------------------------------------- */

const canvas = $("#particle-canvas");
const context = canvas?.getContext("2d");
let particles = [];

function resizeCanvas() {
  if (!canvas || !context) return;

  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;

  context.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );
}

function seedParticles() {
  if (!canvas) return;

  const count = prefersReducedMotion
    ? 35
    : Math.min(95, Math.floor(innerWidth / 13));

  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    z: Math.random(),
    r: Math.random() * 1.8 + .35,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    type: index % 3
  }));
}

function drawParticles() {
  if (!canvas || !context) return;

  context.clearRect(0, 0, innerWidth, innerHeight);

  const mouseX = window.__mouseX ?? innerWidth / 2;
  const mouseY = window.__mouseY ?? innerHeight / 2;

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = innerWidth + 20;
    if (particle.x > innerWidth + 20) particle.x = -20;
    if (particle.y < -20) particle.y = innerHeight + 20;
    if (particle.y > innerHeight + 20) particle.y = -20;

    const alpha = .18 + particle.z * .5;

    context.beginPath();

    context.arc(
      particle.x + (mouseX - innerWidth / 2) * .004 * particle.z,
      particle.y + (mouseY - innerHeight / 2) * .004 * particle.z,
      particle.r * (.75 + particle.z),
      0,
      Math.PI * 2
    );

    if (particle.type === 0) {
      context.fillStyle = `rgba(140,240,255,${alpha})`;
    } else if (particle.type === 1) {
      context.fillStyle = `rgba(155,124,255,${alpha})`;
    } else {
      context.fillStyle = `rgba(255,119,213,${alpha * .75})`;
    }

    context.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 105) {
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle =
          `rgba(140,240,255,${(1 - distance / 105) * .055})`;
        context.lineWidth = .7;
        context.stroke();
      }
    }
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(drawParticles);
  }
}

if (canvas) {
  window.addEventListener("resize", () => {
    resizeCanvas();
    seedParticles();
  });

  resizeCanvas();
  seedParticles();
  drawParticles();
}

window.addEventListener("mousemove", (event) => {
  window.__mouseX = event.clientX;
  window.__mouseY = event.clientY;

  const glow = $("#glow");

  if (glow && !prefersReducedMotion) {
    glow.style.transform =
      `translate(${event.clientX}px,${event.clientY}px)`;
  }
}, { passive: true });

/* ---------------------------------------------------------
   Scroll reveal + card tilt
   --------------------------------------------------------- */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

      observer.unobserve(entry.target);
    });
  },
  { threshold: .12 }
);

$$(".skill-card,.project-card,.timeline-card,.cert-card").forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(22px)";
  element.style.transition =
    "opacity .7s ease, transform .7s ease";

  observer.observe(element);

  if (prefersReducedMotion) return;

  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    element.style.setProperty("--mx", `${px * 100}%`);
    element.style.setProperty("--my", `${py * 100}%`);
    element.style.transition = "transform .1s";

    element.style.transform =
      `perspective(900px)
       rotateX(${((.5 - py) * 7).toFixed(2)}deg)
       rotateY(${((px - .5) * 7).toFixed(2)}deg)
       translateY(-6px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transition = "transform .4s ease";
    element.style.transform = "translateY(0)";
  });
});

/* ---------------------------------------------------------
   Technology marquee
   --------------------------------------------------------- */

const technologies = [
  "Java",
  "Spring Boot",
  "Python",
  "PostgreSQL",
  "REST APIs",
  "Android",
  "AI",
  "Machine Learning",
  "Git",
  "GitHub",
  "DSA",
  "OOP",
  "DBMS",
  "Computer Networks"
];

const track = $("#track");

if (track) {
  track.innerHTML = [...technologies, ...technologies]
    .map((technology) => `<span>${technology}</span>`)
    .join("");
}

/* ---------------------------------------------------------
   Typed roles
   --------------------------------------------------------- */

const roles = [
  "backend development",
  "software engineering",
  "AI integration",
  "Android development",
  "problem solving"
];

const roleElement = $("#role");

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
  if (!roleElement) return;

  const currentRole = roles[roleIndex];

  roleElement.textContent =
    currentRole.slice(0, characterIndex);

  if (!deleting && characterIndex === currentRole.length) {
    deleting = true;
    return setTimeout(typeRole, 1400);
  }

  if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  characterIndex += deleting ? -1 : 1;

  setTimeout(typeRole, deleting ? 35 : 70);
}

if (roleElement) {
  if (prefersReducedMotion) {
    roleElement.textContent = roles[0];
  } else {
    typeRole();
  }
}

/* ---------------------------------------------------------
   Scroll progress + active navigation
   --------------------------------------------------------- */

const navLinks = [...$$(".nav-links a")];
const sections = navLinks.map((link) =>
  $(link.getAttribute("href"))
);

function updateScrollUI() {
  const pageHeight =
    document.documentElement.scrollHeight - innerHeight;

  const progress =
    pageHeight > 0 ? scrollY / pageHeight : 0;

  $("#progress").style.transform =
    `scaleX(${progress})`;

  $("#top-btn").classList.toggle("show", scrollY > 600);

  let currentSection = -1;

  sections.forEach((section, index) => {
    if (
      section &&
      section.getBoundingClientRect().top < innerHeight * .4
    ) {
      currentSection = index;
    }
  });

  navLinks.forEach((link, index) => {
    link.classList.toggle(
      "active",
      index === currentSection
    );
  });

  $(".nav")?.classList.toggle("scrolled", scrollY > 10);
}

window.addEventListener(
  "scroll",
  updateScrollUI,
  { passive: true }
);

updateScrollUI();

/* ---------------------------------------------------------
   Back to top
   --------------------------------------------------------- */

const topButton = $("#top-btn");

if (topButton) {
  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

/* ---------------------------------------------------------
   Magnetic buttons
   --------------------------------------------------------- */

if (!prefersReducedMotion) {
  $$(".btn").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width - .5) * 10;

      const y =
        ((event.clientY - rect.top) / rect.height - .5) * 8 - 2;

      button.style.transform =
        `translate(${x}px,${y}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

/* ---------------------------------------------------------
   Current year
   --------------------------------------------------------- */

const yearElement = $("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
/* Append to the end of js/script.js — subtle portrait tilt following the pointer */
(function () {
  const wrap = document.querySelector('.hero-profile');
  const frame = document.querySelector('.profile-frame');
  if (!wrap || !frame) return;

  const canHover = window.matchMedia('(hover: hover)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduce) return;

  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
    frame.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
  });

  wrap.addEventListener('mouseleave', () => {
    frame.style.setProperty('--ry', '0deg');
    frame.style.setProperty('--rx', '0deg');
  });
})();