import type { Metadata } from "next";
import { Be_Vietnam_Pro, Dancing_Script, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toast";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lovora - Thay lời muốn nói",
  description: "Web quà tặng tình yêu được shop setup theo yêu cầu. Chọn mẫu, gửi ảnh, nhận web quà siêu dễ thương.",
  keywords: ["web quà tặng", "web tặng người yêu", "valentine web", "lovora"],
  openGraph: {
    title: "Lovora - Thay lời muốn nói",
    description: "Web quà tặng tình yêu được shop setup theo yêu cầu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`scroll-smooth ${beVietnam.variable} ${dancingScript.variable} ${caveat.variable}`}>
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
