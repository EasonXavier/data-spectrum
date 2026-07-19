import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataSpectrum · 数据棱镜",
  description: "三角洲行动小队战绩与水平分析工具",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
