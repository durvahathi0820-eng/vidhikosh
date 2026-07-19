(function () {
  "use strict";

  let DATA = { categories: [], terms: [] };
  let activeCategory = null; // category code or null for "all"
  let query = "";

  const els = {
    search: document.getElementById("search"),
    resultCount: document.getElementById("resultCount"),
    chipRow: document.getElementById("chipRow"),
    termList: document.getElementById("termList"),
    detailPanel: document.getElementById("detailPanel"),
  };

  const catByCode = (code) => DATA.categories.find((c) => c.code === code);

  function init() {
    fetch("data/terms.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load terms.json (" + r.status + ")");
        return r.json();
      })
      .then((data) => {
        DATA = data;
        DATA.terms.sort((a, b) => a.term.localeCompare(b.term));
        renderChips();
        renderList();
        renderEmptyState();
        window.addEventListener("hashchange", routeFromHash);
        routeFromHash();
      })
      .catch((err) => {
        els.termList.innerHTML =
          '<p class="no-results">Could not load the dictionary data. If you\'re running this locally, serve the folder with a local server (e.g. <code>python3 -m http.server</code>) rather than opening index.html directly.</p>';
        console.error(err);
      });

    els.search.addEventListener("input", (e) => {
      query = e.target.value.trim().toLowerCase();
      renderList();
    });
  }

  function routeFromHash() {
    const match = location.hash.match(/^#term=(.+)$/);
    if (match) {
      const term = DATA.terms.find((t) => t.id === decodeURIComponent(match[1]));
      if (term) {
        renderEntry(term);
        highlightActiveRow(term.id);
        return;
      }
    }
    renderEmptyState();
    highlightActiveRow(null);
  }

  function renderChips() {
    els.chipRow.innerHTML = "";

    const allChip = document.createElement("button");
    allChip.className = "chip active";
    allChip.textContent = "All (" + DATA.terms.length + ")";
    allChip.dataset.code = "";
    allChip.addEventListener("click", () => setCategory(null));
    els.chipRow.appendChild(allChip);

    DATA.categories.forEach((cat) => {
      const count = DATA.terms.filter((t) => t.category === cat.code).length;
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.style.setProperty("--cat-color", cat.color);
      chip.textContent = cat.name + " (" + count + ")";
      chip.dataset.code = cat.code;
      chip.addEventListener("click", () => setCategory(cat.code));
      els.chipRow.appendChild(chip);
    });
  }

  function setCategory(code) {
    activeCategory = code;
    [...els.chipRow.children].forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.code === (code || ""));
    });
    renderList();
  }

  function getFiltered() {
    return DATA.terms.filter((t) => {
      const matchesCategory = !activeCategory || t.category === activeCategory;
      const haystack = (t.term + " " + t.definition + " " + t.category).toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  function renderList() {
    const filtered = getFiltered();
    els.resultCount.textContent = filtered.length + " / " + DATA.terms.length;
    els.termList.innerHTML = "";

    if (filtered.length === 0) {
      els.termList.innerHTML = '<p class="no-results">No terms match. Try a different search, or clear the subject filter.</p>';
      return;
    }

    filtered.forEach((t) => {
      const cat = catByCode(t.category);
      const row = document.createElement("button");
      row.className = "term-row";
      row.style.setProperty("--cat-color", cat ? cat.color : null);
      row.dataset.id = t.id;
      row.innerHTML =
        '<span class="t-code">' + t.code + '</span><span class="t-name">' + escapeHtml(t.term) + "</span>";
      row.addEventListener("click", () => {
        location.hash = "term=" + encodeURIComponent(t.id);
      });
      els.termList.appendChild(row);
    });
  }

  function highlightActiveRow(id) {
    [...els.termList.querySelectorAll(".term-row")].forEach((row) => {
      row.classList.toggle("active", row.dataset.id === id);
    });
  }

  function renderEmptyState() {
    els.detailPanel.innerHTML =
      '<div class="empty-state">' +
      '<div class="empty-mark" aria-hidden="true"><svg viewBox="0 0 64 64" width="56" height="56">' +
      '<circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<text x="32" y="40" text-anchor="middle" font-family="Fraunces, serif" font-size="24" fill="currentColor">वि</text>' +
      "</svg></div>" +
      "<h2>Select a term to open the entry</h2>" +
      "<p>Search on the left, browse by subject, or click any entry in the index to read its definition, statutory reference, and an example of how it's used.</p>" +
      '<p class="stat-line">' + DATA.terms.length + " terms across " + DATA.categories.length + " subjects, and growing.</p>" +
      "</div>";
  }

  function renderEntry(t) {
    const cat = catByCode(t.category);
    const catColor = cat ? cat.color : "";
    const related = (t.related_terms || [])
      .map((id) => DATA.terms.find((x) => x.id === id))
      .filter(Boolean);

    let html = '<article class="entry" style="--cat-color:' + catColor + '">';
    html +=
      '<div class="entry-eyebrow"><span class="entry-code">' +
      t.code +
      '</span><span class="entry-category">' +
      escapeHtml(cat ? cat.name : t.category) +
      "</span></div>";
    html += "<h1>" + escapeHtml(t.term) + "</h1>";
    html += '<p class="entry-definition">' + escapeHtml(t.definition) + "</p>";

    if (t.statute_reference) {
      html +=
        '<div class="entry-field"><h3>Statutory reference</h3><p>' +
        escapeHtml(t.statute_reference) +
        "</p></div>";
    }
    if (t.example) {
      html +=
        '<div class="entry-field example"><h3>Example</h3><p>' + escapeHtml(t.example) + "</p></div>";
    }
    if (related.length) {
      html += '<div class="entry-field"><h3>See also</h3><div class="related-row">';
      related.forEach((r) => {
        html +=
          '<a class="related-chip" href="#term=' +
          encodeURIComponent(r.id) +
          '">' +
          escapeHtml(r.term) +
          "</a>";
      });
      html += "</div></div>";
    }
    html += "</article>";

    els.detailPanel.innerHTML = html;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  document.querySelector('.wordmark[data-action="home"]').addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState("", document.title, location.pathname + location.search);
    renderEmptyState();
    highlightActiveRow(null);
  });

  init();
})();
