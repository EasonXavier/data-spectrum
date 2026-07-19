# DataSpectrum · 数据棱镜

面向《三角洲行动》公开玩家战绩的纯静态网页工具。当前功能是“KD 鉴定器”：根据总场次、总击杀、总撤离率，以及普通、机密、绝密三条队列的 KD，估算玩家可能的最低绝密场次。

## 在线访问

<https://easonxavier.github.io/DataSpectrum/>

## 架构

站点源码全部位于 `site/`，仅使用 HTML、CSS、JavaScript 和本地 WOFF2 字体：

- 不需要 Node.js 或服务端运行时
- 不需要构建命令
- 所有计算均在浏览器本地完成
- `.github/workflows/pages.yml` 直接把 `site/` 发布到 GitHub Pages

## 本地预览

可以直接打开 `site/index.html`，或使用任意静态文件服务器预览。

## 计算说明

结果是由公开数据约束推导出的下界，不等于真实绝密场次。公开 KD 和撤离率可能经过四舍五入，因此结果不应视为官方战绩证明。
