"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { getTheme } from "@/lib/theme";
import { useState, useMemo, createContext, useContext } from "react";
import 'highlight.js/styles/vs2015.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create Theme Context
const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', newMode);
      }
      return newMode;
    });
  };

  // Load saved theme preference
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) {
        setMode(savedMode);
      }
      // Set data attribute on body for CSS targeting
      document.body.setAttribute('data-theme', savedMode || 'light');
    }
  }, []);

  // Update body attribute when mode changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.setAttribute('data-theme', mode);
    }
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <Layout>
                {children}
              </Layout>
            </AuthProvider>
          </ThemeProvider>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}