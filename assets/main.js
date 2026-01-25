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

/* ===== LOAD BERITA (JSON) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const beritaContainer = document.getElementById("beritaList");
  const emptyState = document.getElementById("beritaEmpty");

  if (!beritaContainer) return;

  fetch("assets/berita.json")
    .then(response => response.json())
    .then(data => {
      beritaContainer.innerHTML = "";

      // JIKA DATA KOSONG
      if (!data || data.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        return;
      }
      
      let html = "";

      data.forEach(berita => {
        html += `
          <div class="card">
            <img src="${berita.gambar}" alt="${berita.judul}">
            <h4>
              <a href="berita-detail.html?id=${berita.id}">
                ${berita.judul}
              </a>
            </h4>
            <p class="meta">${berita.tanggal} • ${berita.kategori}</p>
            <p>${berita.ringkas}</p>
          </div>
        `;
      });

      beritaContainer.innerHTML = html;
    })
    .catch(error => {
      beritaContainer.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
        emptyState.innerHTML = "<p>Gagal memuat berita.</p>";
      }
      console.error(error);
    });
});

/* ===== BERITA DETAIL (JSON) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const judulEl = document.getElementById("judulBerita");
  const metaEl = document.getElementById("metaBerita");
  const gambarEl = document.getElementById("gambarBerita");
  const isiEl = document.getElementById("isiBerita");

  // Jalankan hanya di halaman detail
  if (!judulEl || !metaEl || !gambarEl || !isiEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    judulEl.textContent = "Berita tidak ditemukan";
    return;
  }

  fetch("assets/berita.json")
    .then(res => res.json())
    .then(data => {
      const berita = data.find(item => String(item.id) === String(id));

      if (!berita) {
        judulEl.textContent = "Berita tidak ditemukan";
        return;
      }

      judulEl.textContent = berita.judul;
      metaEl.textContent = `${berita.tanggal} • ${berita.kategori}`;
      gambarEl.src = berita.gambar;
      gambarEl.alt = berita.judul;

      let htmlIsi = "";
      berita.isi.forEach(paragraf => {
        htmlIsi += `<p>${paragraf}</p>`;
      });
      isiEl.innerHTML = htmlIsi;
    })
    .catch(err => {
      judulEl.textContent = "Gagal memuat berita";
      console.error(err);
    });
});



/* ===== LOAD BERITA + LOAD MORE ===== */
document.addEventListener("DOMContentLoaded", function () {
  const beritaContainer = document.getElementById("beritaList");
  const toggleBtn = document.getElementById("toggleBerita");

  if (!beritaContainer || !toggleBtn) return;

  let beritaData = [];
  let limit = 3;
  const STEP = 3;

  function renderBerita() {
    let html = "";

    beritaData.slice(0, limit).forEach(berita => {
      html += `
        <div class="card">
          <img src="${berita.gambar}" alt="${berita.judul}">
          <h4>
            <a href="berita-detail.html?id=${berita.id}">
              ${berita.judul}
            </a>
          </h4>
          <p class="meta">${berita.tanggal} • ${berita.kategori}</p>
          <p>${berita.ringkas}</p>
        </div>
      `;
    });

    beritaContainer.innerHTML = html;

    // Ubah teks tombol
    if (limit >= beritaData.length) {
      toggleBtn.textContent = "Muat Lebih Sedikit";
    } else {
      toggleBtn.textContent = "Muat Lebih Banyak";
    }
  }

  toggleBtn.addEventListener("click", function () {
    if (limit >= beritaData.length) {
      limit = STEP; // reset ke awal
    } else {
      limit += STEP;
    }
    renderBerita();
  });

  fetch("assets/berita.json")
    .then(res => res.json())
    .then(data => {
      beritaData = data;
      renderBerita();
    })
    .catch(() => {
      beritaContainer.innerHTML = "<p>Gagal memuat berita.</p>";
    });
});
