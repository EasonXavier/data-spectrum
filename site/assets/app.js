const fields = ["matches", "kills", "survival", "easy", "normal", "hard"];
const getNumber = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);

function calculate() {
  const values = Object.fromEntries(fields.map((id) => [id, getNumber(id)]));
  const deaths = values.matches * (1 - values.survival / 100);
  const overall = deaths > 0 ? values.kills / deaths : 0;
  const low = Math.min(values.easy, values.normal);
  const high = Math.max(values.easy, values.normal);
  let share = 0;
  let minimum = 0;
  let error = "";

  if (!values.matches || deaths <= 0) {
    error = "需要有效场次、击杀和低于 100% 的撤离率才能计算。";
  } else if (overall < low || overall > high) {
    const anchor = overall > high ? high : low;
    const denominator = values.hard - anchor;
    share = denominator ? (overall - anchor) / denominator : -1;
    if (share < 0 || share > 1 || !Number.isFinite(share)) {
      error = "这些输入无法在当前下界模型中同时成立，请检查撤离率或队列 KD。";
    } else {
      minimum = Math.ceil(deaths * share);
    }
  }

  document.getElementById("minimum").textContent = error ? "—" : String(minimum);
  document.getElementById("deaths").textContent = `${Math.round(deaths)} 场`;
  document.getElementById("overall").textContent = Number.isFinite(overall) ? overall.toFixed(2) : "—";
  document.getElementById("share").textContent = error ? "—" : `${(share * 100).toFixed(1)}%`;
  const warning = document.getElementById("warning");
  warning.textContent = error;
  warning.hidden = !error;
}

fields.forEach((id) => document.getElementById(id).addEventListener("input", calculate));
document.getElementById("kd-form").addEventListener("submit", (event) => event.preventDefault());

const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  toggle.textContent = next === "dark" ? "☀" : "◐";
  document.querySelector('meta[name="theme-color"]').content = next === "dark" ? "#0f0f11" : "#f5f5f7";
});

calculate();
