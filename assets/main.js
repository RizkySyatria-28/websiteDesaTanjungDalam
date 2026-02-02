document.addEventListener("DOMContentLoaded", function () {

  /* =====================
     FOOTER TAHUN OTOMATIS
  ===================== */
  const year = new Date().getFullYear();
  const footer = document.querySelector(".footer-content p");
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace("2026", year);
  }

  /* =====================
     HAMBURGER MENU
  ===================== */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("menuOverlay");

  if (hamburger && navMenu && overlay) {

    const openMenu = () => {
      navMenu.classList.add("show");
      overlay.classList.add("show");
    };

    const closeMenu = () => {
      navMenu.classList.remove("show");
      overlay.classList.remove("show");

      // tutup semua submenu saat menu ditutup
      document.querySelectorAll(".submenu").forEach(s => {
        s.classList.remove("show");
      });
    };

    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.contains("show") ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    /* =====================
       KLIK MENU
    ===================== */
    navMenu.addEventListener("click", function (e) {
      const target = e.target;

      // SUBMENU TOGGLE
      if (target.classList.contains("submenu-toggle")) {
        e.preventDefault();
        e.stopPropagation();

        const submenu = target.nextElementSibling;

        document.querySelectorAll(".submenu").forEach(menu => {
          if (menu !== submenu) menu.classList.remove("show");
        });

        submenu.classList.toggle("show");
        return;
      }

      // LINK BIASA → TUTUP MENU
      if (target.tagName === "A") {
        closeMenu();
      }
    });
  }

  /* =====================
     SMOOTH SCROLL
  ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* =====================
     LOAD BERITA + PAGINATION
  ===================== */
  const beritaContainer = document.getElementById("beritaList");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  if (beritaContainer && prevBtn && nextBtn && pageInfo) {

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
      .catch(() => {
        beritaContainer.innerHTML = "<p>Gagal memuat berita.</p>";
      });

    function renderBerita() {
      beritaContainer.innerHTML = "";
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageData = allBerita.slice(start, start + ITEMS_PER_PAGE);

      pageData.forEach(b => {
        beritaContainer.innerHTML += `
          <div class="card">
            <img src="${b.gambar}" alt="${b.judul}">
            <h4><a href="berita-detail.html?id=${b.id}">${b.judul}</a></h4>
            <p class="meta">${b.tanggal} • ${b.kategori}</p>
            <p>${b.ringkas}</p>
          </div>
        `;
      });
    }

    function updatePagination() {
      const total = Math.ceil(allBerita.length / ITEMS_PER_PAGE);
      pageInfo.textContent = `Halaman ${currentPage} dari ${total}`;
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === total;
    }

    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderBerita();
        updatePagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    nextBtn.onclick = () => {
      if (currentPage < Math.ceil(allBerita.length / ITEMS_PER_PAGE)) {
        currentPage++;
        renderBerita();
        updatePagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  }

  /* =====================
     BERITA DETAIL
  ===================== */
  const judulEl = document.getElementById("judulBerita");
  const metaEl = document.getElementById("metaBerita");
  const gambarEl = document.getElementById("gambarBerita");
  const isiEl = document.getElementById("isiBerita");

  if (judulEl && metaEl && gambarEl && isiEl) {
    const id = new URLSearchParams(location.search).get("id");

    fetch("assets/berita.json")
      .then(res => res.json())
      .then(data => {
        const b = data.find(x => String(x.id) === id);
        if (!b) return;

        judulEl.textContent = b.judul;
        metaEl.textContent = `${b.tanggal} • ${b.kategori}`;
        gambarEl.src = b.gambar;

        isiEl.innerHTML = b.isi.map(p => `<p>${p}</p>`).join("");
      });
  }

  /* =====================
     UMKM LIST
  ===================== */
  const umkmContainer = document.getElementById("umkmList");
  if (umkmContainer) {
    fetch("assets/umkm.json")
      .then(res => res.json())
      .then(data => {
        umkmContainer.innerHTML = data.map(u => `
          <div class="card">
            <img src="${u.gambar}">
            <h4><a href="detail-umkm.html?id=${u.id}">${u.nama}</a></h4>
            <p>${u.deskripsi_singkat}</p>
            <p><strong>Pemilik:</strong> ${u.pemilik}</p>
            <p><strong>Kontak:</strong> ${u.kontak}</p>
          </div>
        `).join("");
      });
  }

  /* =====================
     DETAIL UMKM
  ===================== */
  const namaUMKM = document.getElementById("namaUMKM");
  if (namaUMKM) {
    const id = new URLSearchParams(location.search).get("id");

    fetch("assets/umkm.json")
      .then(res => res.json())
      .then(data => {
        const u = data.find(x => String(x.id) === id);
        if (!u) return;

        document.getElementById("gambarUMKM").src = u.gambar;
        document.getElementById("pemilikUMKM").textContent = u.pemilik;
        document.getElementById("kontakUMKM").textContent = u.kontak;
        document.getElementById("alamatUMKM").textContent = u.alamat;
        namaUMKM.textContent = u.nama;

        document.getElementById("deskripsiUMKM").innerHTML =
          u.deskripsi_lengkap.map(p => `<p>${p}</p>`).join("");
      });
  }

});
