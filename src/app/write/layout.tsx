import React from "react";
import { Header } from "@/components/layout/Header";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <div>
          <Header />
          {children}
      </div>
    );
}
