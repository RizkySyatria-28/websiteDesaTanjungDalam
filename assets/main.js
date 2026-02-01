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

/* ===== LOAD BERITA + PAGINATION ===== */
document.addEventListener("DOMContentLoaded", function () {
  const beritaContainer = document.getElementById("beritaList");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  if (!beritaContainer || !prevBtn || !nextBtn || !pageInfo) return;

  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let allBerita = [];

  fetch("assets/berita.json")
    .then(res => res.json())
    .then(data => {
      allBerita = data;
      renderBerita();
      updatePagination();
    })
    .catch(err => {
      beritaContainer.innerHTML = "<p>Gagal memuat berita.</p>";
      console.error(err);
    });

  function renderBerita() {
    beritaContainer.innerHTML = "";

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = allBerita.slice(start, end);

    pageData.forEach(berita => {
      beritaContainer.innerHTML += `
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
  }

  function totalPages() {
    return Math.ceil(allBerita.length / ITEMS_PER_PAGE);
  }

  function updatePagination() {
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages()}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages();
  }

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderBerita();
      updatePagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentPage < totalPages()) {
      currentPage++;
      renderBerita();
      updatePagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

/* ===== LOAD UMKM (JSON) ===== */
document.addEventListener("DOMContentLoaded", function () {
  const umkmContainer = document.getElementById("umkmList");
  if (!umkmContainer) return;

  fetch("assets/umkm.json")
    .then(res => res.json())
    .then(data => {
      let html = "";

      data.forEach(umkm => {
        html += `
          <div class="card">
            <img src="${umkm.gambar}" alt="${umkm.nama}">
            <h4>
              <a href="detail-umkm.html?id=${umkm.id}">
                ${umkm.nama}
              </a>
            </h4>
            <p>${umkm.deskripsi_singkat}</p>
            <p><strong>Pemilik:</strong> ${umkm.pemilik}</p>
            <p><strong>Kontak:</strong> ${umkm.kontak}</p>
          </div>
        `;
      });

      umkmContainer.innerHTML = html;
    })
    .catch(err => {
      umkmContainer.innerHTML = "<p>Gagal memuat data UMKM.</p>";
      console.error(err);
    });
});


/* ===== DETAIL UMKM ===== */
document.addEventListener("DOMContentLoaded", function () {
  const namaEl = document.getElementById("namaUMKM");
  const gambarEl = document.getElementById("gambarUMKM");
  const pemilikEl = document.getElementById("pemilikUMKM");
  const kontakEl = document.getElementById("kontakUMKM");
  const alamatEl = document.getElementById("alamatUMKM");
  const deskripsiEl = document.getElementById("deskripsiUMKM");

  if (!namaEl) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("assets/umkm.json")
    .then(res => res.json())
    .then(data => {
      const umkm = data.find(item => String(item.id) === id);

      if (!umkm) {
        namaEl.textContent = "UMKM tidak ditemukan";
        return;
      }

      namaEl.textContent = umkm.nama;
      gambarEl.src = umkm.gambar;
      pemilikEl.textContent = umkm.pemilik;
      kontakEl.textContent = umkm.kontak;
      alamatEl.textContent = umkm.alamat;

      let html = "";
      umkm.deskripsi_lengkap.forEach(p => {
        html += `<p>${p}</p>`;
      });
      deskripsiEl.innerHTML = html;
    })
    .catch(err => {
      namaEl.textContent = "Gagal memuat data UMKM";
      console.error(err);
    });
});
