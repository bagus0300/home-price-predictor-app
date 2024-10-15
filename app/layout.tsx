import "./globals.css";
import { Inter } from "next/font/google";
import Localfont from "next/font/local";
import type { Metadata } from "next";
import { HomeDataProvider } from "./hooks/useData";
import { Providers } from './providers'


const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const poppins  = Localfont({
  src: "../public/fonts/Poppins-Medium.ttf",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  // title: "CommuneAI web3event Map",
  title: "World Home Price Predictor App",
  description: "you can find home price and predict in the work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en"
      className={[inter.variable, poppins.variable].join(" ")}
    >
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body className="bg-black w-full">
        <Providers><HomeDataProvider>{children}</HomeDataProvider></Providers>
      </body>
    </html>
  );
}
