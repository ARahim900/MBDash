"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useState, useEffect, createContext, useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

// Create context for sidebar state
export const SidebarContext = createContext({
  isCollapsed: false,
  setIsCollapsed: (value: boolean) => { },
});

export const useSidebar = () => useContext(SidebarContext);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Auto-collapse on smaller screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Muscat Bay Operations</title>
        <meta name="description" content="Operations Dashboard for Muscat Bay" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
          <div className="h-full relative overflow-x-hidden">
            {/* Sidebar - fixed position */}
            <div
              className={`hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}
              style={{
                backgroundColor: "var(--mb-primary)"
              }}
            >
              <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>
            {/* Main content - dynamic padding */}
            <main
              className={`pb-10 transition-all duration-300 w-full min-w-0 overflow-x-hidden pl-0 ${isMounted ? (isCollapsed ? 'md:pl-20' : 'md:pl-72') : 'md:pl-72'}`}
            >
              <Topbar />
              {children}
            </main>
          </div>
        </SidebarContext.Provider>
      </body>
    </html>
  );
}
