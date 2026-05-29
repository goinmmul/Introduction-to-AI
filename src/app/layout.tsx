import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "메오티",
  description: "빛가람혁신도시 조건 기반 메뉴 추천 MVP"
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Recommend" },
  { href: "/about", label: "About" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-xl font-bold text-meoti-navy">
              메오티
            </Link>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 transition hover:bg-meoti-sky hover:text-meoti-blue"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>메오티 MVP · Introduction to AI Final Project</p>
            <p>빛가람혁신도시 메뉴 데이터 기반 추천</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
