const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const navToggle = document.querySelector(".nav-toggle");
const themeButtons = document.querySelectorAll("[data-theme-button]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const progress = document.querySelector(".scroll-progress span");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setTheme(theme, persist = true) {
  const nextTheme = theme === "nocturne" ? "nocturne" : "paper";
  root.dataset.theme = nextTheme;
  themeColor?.setAttribute("content", nextTheme === "nocturne" ? "#07090c" : "#eee9df");

  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeButton === nextTheme));
  });

  if (persist) {
    try {
      localStorage.setItem("dkz-theme", nextTheme);
    } catch (_) {
      // Theme persistence is optional when storage is unavailable.
    }
  }
}

setTheme(root.dataset.theme, false);
themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeButton));
});

function setNavOpen(isOpen) {
  header?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
}

navToggle?.addEventListener("click", () => {
  setNavOpen(!header?.classList.contains("is-open"));
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) setNavOpen(false);
});

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -42px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = document.querySelectorAll("[data-section][id]");
const navLinks = document.querySelectorAll("[data-nav-link]");

function setActiveSection(id) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

setActiveSection("overview");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target.id) setActiveSection(visible.target.id);
    },
    { rootMargin: "-22% 0px -58%", threshold: [0, 0.15, 0.35] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

let scrollFrame = 0;

function updateScrollProgress() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  if (progress) progress.style.transform = `scaleX(${ratio})`;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);

updateScrollProgress();

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const cursor = document.querySelector(".cursor");

if (finePointer.matches && !reducedMotion.matches && cursor) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    element.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });
}

const figure = document.querySelector("[data-figure]");

if (finePointer.matches && !reducedMotion.matches && figure) {
  figure.addEventListener("pointermove", (event) => {
    const bounds = figure.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    figure.style.transform = `perspective(900px) rotateX(${-y * 2.4}deg) rotateY(${x * 2.4}deg)`;
  });

  figure.addEventListener("pointerleave", () => {
    figure.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  });
}
