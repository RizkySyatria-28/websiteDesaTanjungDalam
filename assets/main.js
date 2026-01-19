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

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("show");
    });
  }
});
