import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Yeuweb - Thay lời muốn nói",
  description: "Web quà tặng tình yêu được shop setup theo yêu cầu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable}`} data-theme="light" suppressHydrationWarning>
      <body>
        <div className="fixed inset-0 -z-10 overflow-hidden bg-romance-dark">
          <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-400/28 blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-400/18 blur-[120px]" />
          <div className="absolute left-[-10%] top-[35%] h-[420px] w-[420px] rounded-full bg-rose-300/22 blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_82%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
        </div>

        <main className="min-h-screen text-foreground antialiased">{children}</main>
      </body>
    </html>
  );
}
