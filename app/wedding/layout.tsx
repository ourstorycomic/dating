import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Thiệp Cưới Online Lovora - Sang trọng, Tinh tế & Dễ dàng",
  description:
    "Tạo thiệp cưới online cao cấp chỉ trong vài phút. 6 mẫu thiệp đẹp, tích hợp form xác nhận tham dự, bản đồ dẫn đường và nhạc nền lãng mạn. Giá từ 139.000đ.",
  keywords: [
    "thiệp cưới online",
    "thiệp cưới điện tử",
    "lovora wedding",
    "thiệp cưới đẹp",
    "mẫu thiệp cưới",
  ],
  openGraph: {
    title: "Thiệp Cưới Online Lovora - Sang trọng, Tinh tế & Dễ dàng",
    description:
      "Tạo thiệp cưới online cao cấp chỉ trong vài phút. 6 mẫu thiệp đẹp, tích hợp form xác nhận tham dự và bản đồ dẫn đường.",
    type: "website",
    images: [
      {
        url: "https://lovora.vn/og-logo.png",
        width: 1200,
        height: 630,
        alt: "Lovora Wedding - Thiệp cưới online cao cấp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp Cưới Online Lovora - Sang trọng, Tinh tế & Dễ dàng",
    description:
      "Tạo thiệp cưới online cao cấp chỉ trong vài phút. 6 mẫu thiệp đẹp, tích hợp form xác nhận tham dự và bản đồ.",
    images: ["https://lovora.vn/og-logo.png"],
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
