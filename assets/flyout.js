export function initFlyout() {
  const flyout = document.getElementById("flyout");
  const backdrop = document.getElementById("flyout-backdrop");
  const close = document.getElementById("flyout-close");

  function closeFlyout() {
    if (!flyout) {
      return;
    }

    flyout.classList.remove("open");

    if (backdrop) {
      backdrop.classList.remove("open");
    }

    document.body.style.overflow = "";
  }

  if (close) close.addEventListener("click", closeFlyout);

  if (backdrop) backdrop.addEventListener("click", closeFlyout);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFlyout();
    }
  });

  return {
    open(data) {
      if (!flyout) {
        return;
      }

      const title = document.getElementById("flyout-title");
      const body = document.getElementById("flyout-body");
      if (title) {
        title.textContent = data.name;
      }

      if (body) {
        const exData = data.examples !== undefined ? data.examples : data.example;
        let exampleBlocks = [];
        if (Array.isArray(exData)) {
          for (const ex of exData) {
            if (Array.isArray(ex)) {
              if (ex.length === 0) continue;
              const s = ex.map((x) => (x == null ? "" : String(x))).join("\n").trim();
              if (s === "" || s.toLowerCase() === "null" || s === "undefined") continue;
              exampleBlocks.push(s);
              continue;
            }
            if (ex == null) continue;
            const s = String(ex).trim();
            if (s === "" || s.toLowerCase() === "null" || s === "[]" || s === "undefined") continue;
            exampleBlocks.push(s);
          }
        } else if (exData != null) {
          const s = String(exData).trim();
          if (!(s === "" || s.toLowerCase() === "null" || s === "[]" || s === "undefined")) {
            exampleBlocks.push(s);
          }
        }
        const hasExample = exampleBlocks.length > 0;

        const args = data.arguments;
        let argsStr = "";
        if (Array.isArray(args)) {
          if (args.length > 0) {
            argsStr = args.map((x) => (x == null ? "" : String(x))).join("\n");
          }
        } else if (args != null) {
          argsStr = String(args).trim();
        }
        const hasArgs =
          argsStr !== "" &&
          argsStr.toLowerCase() !== "null" &&
          argsStr !== "undefined";

        body.innerHTML = `<div class="flyout-section"><strong>Added:</strong> ${data.added || "unknown"}${data.removed ? "<br><strong>Removed:</strong> " + data.removed : ""}</div>
<div class="flyout-section"><strong>Description</strong><p>${escapeHtml(data.description || "")}</p></div>
<div class="flyout-section"><strong>Syntax</strong><div class="code-block"><pre><code>${escapeHtml(data.syntax || "")}</code></pre></div>${hasArgs ? `<div class="flyout-subsection"><strong>Arguments</strong><div class="code-block"><pre><code>${escapeHtml(argsStr)}</code></pre></div></div>` : ""}</div>
${hasExample ? `<div class="flyout-section"><div class="example-header"><strong>${exampleBlocks.length > 1 ? "Examples" : "Example"}</strong><button class="copy-btn" aria-label="Copy example(s) to clipboard" title="Copy to clipboard">⮺</button></div>${exampleBlocks.map((b) => `<div class="example-code-block"><pre><code>${escapeHtml(b)}</code></pre></div>`).join("")}</div>` : ""}
${data.notes ? '<div class="flyout-section"><strong>Notes</strong><p>' + escapeHtml(data.notes) + "</p></div>" : ""}`;

        body.querySelectorAll(".example-header .copy-btn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const section = btn.closest(".flyout-section");
            const codeEls = section ? section.querySelectorAll(".example-code-block pre code") : [];
            const texts = Array.from(codeEls).map((el) => el.textContent);
            const text = texts.join("\n\n");
            try {
              await navigator.clipboard.writeText(text);
              const old = btn.textContent;
              btn.textContent = "✓";
              setTimeout(() => {
                btn.textContent = old;
              }, 1200);
            } catch (e) {
              // ignore
            }
          });
        });
      }

      flyout.classList.add("open");

      if (backdrop) {
        backdrop.classList.add("open");
      }

      document.body.style.overflow = "hidden";

      if (data.name) {
        location.hash = `#command=${data.name}`;
      }
    },
  };
}
function escapeHtml(s) {
  return s.replace(
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
