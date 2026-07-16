(function () {
  const page = document.body.dataset.page || "home";

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const btn = document.getElementById("themeButton");
    if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  window.toggleTheme = function () {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
    updateThemeIcon();
  };

  window.filterCards = function () {
    const input = document.getElementById("searchInput");
    if (!input) return;
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(".searchable").forEach((card) => {
      card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(q));
    });
  };

  function renderNav() {
    setText("brandText", SITE_CONTENT.siteName);
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === page) a.classList.add("active");
    });
  }

  function cardHtml(item, type) {
    const icon = item.icon ? `<div class="card-icon">${item.icon}</div>` : "";
    const linkText =
      type === "section" ? "تصفح القسم ←" :
      type === "summary" ? "قراءة الملخص ←" :
      type === "nasheed" ? "عرض التفاصيل ←" : "";
    const link = item.link && item.link !== "#"
      ? `<a href="${item.link}">${linkText}</a>`
      : (linkText ? `<a href="#">${linkText}</a>` : "");
    return `
      <article class="card searchable">
        ${icon}
        <h3>${item.title}</h3>
        <p>${item.description || ""}</p>
        ${link}
      </article>
    `;
  }

  function renderHome() {
    setText("heroTitle", SITE_CONTENT.siteName);
    setText("heroDescription", SITE_CONTENT.description);
    setText("welcomeTitle", SITE_CONTENT.home.welcomeTitle);
    setText("welcomeText", SITE_CONTENT.home.welcomeText);
    setText("latestTitle", SITE_CONTENT.home.latestTitle);

    const sections = document.getElementById("sectionsGrid");
    if (sections) {
      sections.innerHTML = SITE_CONTENT.sections
        .map((x) => cardHtml(x, "section"))
        .join("");
    }

    const latest = document.getElementById("latestGrid");
    if (latest) {
      const latestItems = [
        SITE_CONTENT.bookSummaries[0] && {
          ...SITE_CONTENT.bookSummaries[0],
          icon: "📖",
          link: "summaries.html"
        },
        SITE_CONTENT.information[0] && {
          ...SITE_CONTENT.information[0],
          link: "knowledge.html"
        },
        SITE_CONTENT.nasheeds[0] && {
          ...SITE_CONTENT.nasheeds[0],
          icon: "🎵",
          link: "nasheeds.html"
        }
      ].filter(Boolean);
      latest.innerHTML = latestItems.map((x) => cardHtml(x, "section")).join("");
    }
  }

  function renderList(targetId, items, type) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!items.length) {
      target.innerHTML = `<div class="empty">لا يوجد محتوى بعد</div>`;
      return;
    }
    target.innerHTML = items.map((x) => cardHtml(x, type)).join("");
  }

  renderNav();
  initTheme();

  if (page === "home") renderHome();
  if (page === "summaries") renderList("contentGrid", SITE_CONTENT.bookSummaries, "summary");
  if (page === "knowledge") renderList("contentGrid", SITE_CONTENT.information, "knowledge");
  if (page === "nasheeds") renderList("contentGrid", SITE_CONTENT.nasheeds, "nasheed");

  setText("footerName", SITE_CONTENT.siteName);
})();