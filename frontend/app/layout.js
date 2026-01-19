"use client";

import "./globals.css";
import "../styles/WalletButton.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Web3Provider } from "../components/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <title>AgriTrace - Blockchain Supply Chain Transparency</title>
        <meta
          name="description"
          content="Blockchain-verified supply chain transparency for agricultural products"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} bg-white dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100`}
      >
        <Web3Provider>
          <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#10B981",
                  },
                },
                error: {
                  style: {
                    background: "#EF4444",
                  },
                },
              }}
            />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
