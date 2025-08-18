// src/components/layout/Layout.tsx
import * as React from "react";
import { Header } from "./Header";

export type LayoutProps = {
  children: React.ReactNode;
  /** Affiche la topbar globale (Header). Par défaut: true */
  showTopbar?: boolean;
};

export function Layout({ children, showTopbar = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showTopbar={showTopbar} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;