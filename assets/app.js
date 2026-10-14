import { initTheme } from "./theme.js";
import { initVersionSelector, filterCommands } from "./version-selector.js";
import { initFlyout } from "./flyout.js";

let allCommands = [];
let flyoutApi;

function groupBySection(cmds) {
  const groups = { actions: [], features: [], cli: [], selectors: [] };
  for (const c of cmds) {
    const cat = c.category;
    if (cat === "action") groups.actions.push(c);
    else if (cat === "feature") groups.features.push(c);
    else if (cat === "cli") groups.cli.push(c);
  }
  return groups;
}

function escapeHtml(s) {
  return (s || "").replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

function renderCommands(version) {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }

  const filtered = filterCommands(allCommands, version);
  const groups = groupBySection(filtered);
  const sections = [
    { id: "actions", title: "Actions", items: groups.actions },
    { id: "features", title: "Features", items: groups.features },
    { id: "cli", title: "CLI Arguments", items: groups.cli },
    { id: "selectors", title: "Selectors", items: groups.selectors },
  ];

  main.innerHTML = "";

  for (const sec of sections) {
    const h2 = document.createElement("h2");
    h2.id = sec.id;
    h2.textContent = sec.title;

    main.appendChild(h2);

    const list = document.createElement("div");
    list.className = "commands-grid";

    for (const c of sec.items) {
      const card = document.createElement("div");

      card.className = "command-card";
      card.tabIndex = 0;

      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open details for ${c.name}`);

      card.innerHTML = `<h3 class="command-card-title">${c.name}</h3>
<div class="command-card-meta"><span class="chip">Introduced in ${c.added}</span>${c.removed ? '<span class="chip removed">Deprecated in ' + c.removed + "</span>" : ""}</div>
<p class="command-card-desc">${escapeHtml(c.description || "")}</p>
<pre class="code-block"><code>${escapeHtml(c.syntax || "")}</code></pre>`;

      card.addEventListener("click", () => flyoutApi && flyoutApi.open(c));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flyoutApi && flyoutApi.open(c);
        }
      });

      list.appendChild(card);
    }

    if (sec.id === "selectors") {
      const note = document.createElement("div");
      note.className = "selectors-note";
      note.innerHTML = "<p>Selectors: Guide coming soon.</p>";

      list.appendChild(note);
    }
    main.appendChild(list);
  }
}

async function loadData() {
  const res = await fetch("commands.json");
  const data = await res.json();
  allCommands = data.commands;
  const versionSel = document.getElementById("version-select");
  if (versionSel) {
    const vs = ["historical", ...data.versions.slice().reverse()];
    versionSel.innerHTML = vs
      .map((v) => `<option value="${v}">${v}</option>`)
      .join("");
  }
  initVersionSelector({ onChange: (v) => renderCommands(v) });
}

async function init() {
  initTheme();
  flyoutApi = initFlyout();
  await loadData();
  // render based on current selector
  const sel = document.getElementById("version-select");
  renderCommands(sel ? sel.value : "historical");
}
init();
