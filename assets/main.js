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
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {

    // Jika link adalah toggle submenu → JANGAN tutup menu
    if (this.classList.contains("submenu-toggle")) {
      return;
    }

    // Jika klik submenu item atau menu biasa → tutup menu
    closeMenu();
  });
});

  // Klik overlay -> tutup
  overlay.addEventListener("click", closeMenu);
});

/* ===== SUBMENU MOBILE ===== */
document.querySelectorAll(".submenu-toggle").forEach(function (toggle) {
  toggle.addEventListener("click", function (e) {
    e.preventDefault();

    const submenu = this.nextElementSibling;

    // Tutup submenu lain (opsional, tapi rapi)
    document.querySelectorAll(".submenu").forEach(function (menu) {
      if (menu !== submenu) {
        menu.classList.remove("show");
      }
    });

    submenu.classList.toggle("show");
  });
});
