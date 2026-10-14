export function initVersionSelector({ onChange }) {
  const select = document.getElementById("version-select");
  if (!select) {
    return;
  }

  select.addEventListener("change", () => {
    const val = select.value;
    if (onChange) onChange(val);
    if (val && val !== "historical") {
      location.hash = `#v=${val}`;
    } else if (val === "historical") {
      location.hash = "";
    }
  });

  // set from hash
  const m = location.hash.match(/#v=([^&]+)/);
  if (m) {
    select.value = m[1];
    if (onChange) onChange(m[1]);
  } else {
    if (onChange) onChange(select.value);
  }
}
export function filterCommands(commands, version) {
  if (!version || version === "historical") return commands.slice();
  return commands.filter((c) => c.added <= version);
}
