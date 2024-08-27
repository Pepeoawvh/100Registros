import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "100 Registros",
  description: "Proyecto x Jpp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <footer className="text-zinc-700 text-center mb-2 border-t-2 border-b-2 border-gray-900">By pp ©</footer>
    </html>
  );
}
