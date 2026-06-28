import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toast";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Lovora - Thay lời muốn nói",
  description: "Web quà tặng tình yêu được shop setup theo yêu cầu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable}`}>
      <body>
        <div className="fixed inset-0 -z-10 overflow-hidden bg-romance-dark">
          <div className="absolute inset-0 dreamy-sky" />
          <div className="absolute left-[-8%] top-[-12%] h-[420px] w-[420px] rounded-full bg-[#ffd4e8]/70 blur-[110px]" />
          <div className="absolute right-[-10%] top-[18%] h-[500px] w-[500px] rounded-full bg-[#d9f4ff]/75 blur-[120px]" />
          <div className="absolute bottom-[-18%] left-[24%] h-[520px] w-[520px] rounded-full bg-[#fff0b8]/70 blur-[120px]" />
          <div className="absolute inset-0 dreamy-pattern opacity-70" />
        </div>

        <main className="min-h-screen text-foreground antialiased">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
