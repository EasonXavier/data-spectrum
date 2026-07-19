const fields = ["matches", "kills", "survival", "easy", "normal", "hard"];
const getNumber = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);

function calculate() {
  const values = Object.fromEntries(fields.map((id) => [id, getNumber(id)]));
  const deaths = Math.round(values.matches * (1 - values.survival / 100));
  const survived = Math.max(0, values.matches - deaths);
  const overall = deaths > 0 ? values.kills / deaths : 0;
  const interval = (displayed) => displayed <= 0.1
    ? { low: 0, high: 0.15 }
    : { low: Math.max(0, displayed - 0.05), high: displayed + 0.05 };
  const easy = interval(values.easy);
  const normal = interval(values.normal);
  const hard = interval(values.hard);
  const low = Math.min(easy.low, normal.low);
  const high = Math.max(easy.high, normal.high);
  let minimumShare = 0;
  let maximumShare = 1;
  let minimum = 0;
  let maximum = values.matches;
  let upperConstrained = false;
  let error = "";

  if (!values.matches || deaths <= 0) {
    error = "需要有效场次、击杀和低于 100% 的撤离率才能计算。";
  } else {
    let feasibleLow = 0;
    let feasibleHigh = 1;
    const restrictLessOrEqual = (start, slope, target) => {
      if (slope > 0) feasibleHigh = Math.min(feasibleHigh, (target - start) / slope);
      else if (slope < 0) feasibleLow = Math.max(feasibleLow, (target - start) / slope);
      else if (start > target) feasibleLow = 2;
    };
    const restrictGreaterOrEqual = (start, slope, target) => {
      if (slope > 0) feasibleLow = Math.max(feasibleLow, (target - start) / slope);
      else if (slope < 0) feasibleHigh = Math.min(feasibleHigh, (target - start) / slope);
      else if (start < target) feasibleLow = 2;
    };

    restrictLessOrEqual(low, hard.low - low, overall);
    restrictGreaterOrEqual(high, hard.high - high, overall);
    feasibleLow = Math.max(0, feasibleLow);
    feasibleHigh = Math.min(1, feasibleHigh);

    if (feasibleLow > feasibleHigh || !Number.isFinite(feasibleLow) || !Number.isFinite(feasibleHigh)) {
      error = "这些输入无法在当前区间模型中同时成立，请检查撤离率或队列 KD。";
    } else {
      minimumShare = feasibleLow;
      maximumShare = feasibleHigh;
      minimum = Math.ceil(deaths * minimumShare);
      const maximumHardDeaths = Math.floor(deaths * maximumShare);
      maximum = Math.min(values.matches, maximumHardDeaths + survived);
      upperConstrained = maximum < values.matches;
    }
  }

  document.getElementById("minimum").textContent = error ? "—" : String(minimum);
  document.getElementById("maximum").textContent = error ? "—" : upperConstrained ? String(maximum) : "无法约束";
  document.getElementById("maximum").classList.toggle("unbounded", !error && !upperConstrained);
  document.getElementById("deaths").textContent = `${Math.round(deaths)} 场`;
  document.getElementById("overall").textContent = Number.isFinite(overall) ? overall.toFixed(2) : "—";
  document.getElementById("share").textContent = error ? "—" : `${(minimumShare * 100).toFixed(1)}%–${(maximumShare * 100).toFixed(1)}%`;
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
