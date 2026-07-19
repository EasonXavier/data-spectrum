"use client";

import { useMemo, useState } from "react";

type Inputs = { matches: number; kills: number; survival: number; easy: number; normal: number; hard: number };

function calculate(v: Inputs) {
  const deaths = v.matches * (1 - v.survival / 100);
  if (!v.matches || deaths <= 0) return { status: "insufficient" as const, deaths, min: 0, share: 0, overall: 0, anchor: 0 };
  const overall = v.kills / deaths;
  const others = [v.easy, v.normal];
  const low = Math.min(...others);
  const high = Math.max(...others);
  if (overall >= low && overall <= high) return { status: "valid" as const, deaths, min: 0, share: 0, overall, anchor: overall };
  const anchor = overall > high ? high : low;
  const denominator = v.hard - anchor;
  if (!denominator || (overall - anchor) / denominator < 0) return { status: "conflict" as const, deaths, min: 0, share: 0, overall, anchor };
  const share = (overall - anchor) / denominator;
  if (share > 1) return { status: "conflict" as const, deaths, min: 0, share, overall, anchor };
  return { status: "valid" as const, deaths, min: Math.max(0, Math.ceil(deaths * share)), share, overall, anchor };
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [values, setValues] = useState<Inputs>({ matches: 486, kills: 1248, survival: 42.6, easy: 2.18, normal: 3.72, hard: 5.46 });
  const result = useMemo(() => calculate(values), [values]);
  const set = (key: keyof Inputs, value: string) => setValues({ ...values, [key]: Math.max(0, Number(value) || 0) });

  return <main className="site" data-theme={theme}>
    <div className="ambient ambientOne" aria-hidden="true" /><div className="ambient ambientTwo" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#top" aria-label="DataSpectrum 首页"><span className="brandMark" aria-hidden="true"><i /><i /><i /></span><span>DataSpectrum<small>数据棱镜</small></span></a>
      <div className="headerActions"><span className="version">KD 鉴定器 · ALPHA 0.1</span><button className="themeToggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="切换明暗主题">{theme === "dark" ? "☀" : "◐"}</button></div>
    </header>

    <div className="pageShell" id="top">
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">DELTA FORCE · PUBLIC STATS LAB</p>
          <h1>从公开 KD，推算<br/><em>绝密对局的最低下界</em></h1>
          <p className="lead">只分析一个玩家。输入公开战绩，DataSpectrum 会计算：为了让三条匹配队列的 KD 与总击杀同时成立，绝密队列至少需要出现多少场。</p>
          <div className="principle"><span>计算原则</span><p>只给出数据能够证明的最低值，不猜测未公开的真实场次分布。</p></div>
        </div>

        <section className="toolCard" aria-labelledby="tool-title">
          <div className="cardTop"><div><p className="kicker">01 / AVAILABLE</p><h2 id="tool-title">KD 鉴定器</h2></div><span className="ready"><i /> 可用</span></div>
          <div className="inputGrid">
            <label>总场次<input type="number" value={values.matches} onChange={e => set("matches", e.target.value)} /></label>
            <label>总击杀数<input type="number" value={values.kills} onChange={e => set("kills", e.target.value)} /></label>
            <label>总撤离率<input type="number" step="0.1" value={values.survival} onChange={e => set("survival", e.target.value)} /><span>%</span></label>
          </div>
          <div className="queueTitle"><span>各匹配队列 KD</span><small>KILLS / DEATH</small></div>
          <div className="queueGrid">
            <label><b>Easy</b><span>普通</span><input type="number" step="0.01" value={values.easy} onChange={e => set("easy", e.target.value)} /></label>
            <label><b>Normal</b><span>机密</span><input type="number" step="0.01" value={values.normal} onChange={e => set("normal", e.target.value)} /></label>
            <label className="hard"><b>Hard</b><span>绝密</span><input type="number" step="0.01" value={values.hard} onChange={e => set("hard", e.target.value)} /></label>
          </div>

          <div className={`result ${result.status}`}>
            <div><p>可能的最低绝密场次</p><strong>{result.status === "valid" ? result.min : "—"}</strong><span>场</span></div>
            <div className="resultMeta">
              <p><span>估算总阵亡</span><b>{Math.round(result.deaths)} 场</b></p>
              <p><span>反推总体 KD</span><b>{Number.isFinite(result.overall) ? result.overall.toFixed(2) : "—"}</b></p>
              <p><span>绝密阵亡占比下界</span><b>{result.status === "valid" ? `${(result.share * 100).toFixed(1)}%` : "—"}</b></p>
            </div>
          </div>
          {result.status === "conflict" && <p className="warning">这些输入无法在当前下界模型中同时成立，请检查撤离率或队列 KD 是否录入正确。</p>}
          {result.status === "insufficient" && <p className="warning">需要有效场次、击杀和撤离率才能计算。</p>}
          <p className="finePrint">下界 ≠ 真实场次。公开撤离率和 KD 可能经过四舍五入，且一场可能包含不同结算状态；结果适合鉴别“至少打过多少”，不适合作为官方战绩证明。</p>
        </section>
      </section>

      <section className="roadmap">
        <div className="sectionHeading"><div><p className="eyebrow">NEXT MODULE</p><h2>玩家评价系统</h2></div><span>设计占位 · 暂未启用</span></div>
        <div className="placeholderGrid">
          <article><b>交战能力</b><div className="ghostBar"><i style={{width:"72%"}} /></div><p>等待真实样本与权重校准</p></article>
          <article><b>生存决策</b><div className="ghostBar"><i style={{width:"58%"}} /></div><p>等待不同队列基准线</p></article>
          <article><b>综合评价</b><strong>—</strong><p>不输出未经验证的玩家等级</p></article>
        </div>
      </section>
    </div>
    <footer><span>DATASPECTRUM / 数据棱镜</span><span>只计算可解释的数据下界</span></footer>
  </main>;
}
