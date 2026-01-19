document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const footer = document.querySelector(".footer-content p");
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace("2026", year);
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("menuOverlay");

  if (!hamburger || !navMenu || !overlay) return;

  function openMenu() {
    navMenu.classList.add("show");
    overlay.classList.add("show");
  }

  function closeMenu() {
    navMenu.classList.remove("show");
    overlay.classList.remove("show");
  }

  // Toggle menu
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    if (navMenu.classList.contains("show")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Klik item menu -> tutup
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Klik overlay -> tutup
  overlay.addEventListener("click", closeMenu);
});
