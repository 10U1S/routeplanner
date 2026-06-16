"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "route-planner-theme";

const themeListeners = new Set<() => void>();

function getStoredTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  applyTheme(getStoredTheme());
  listener();

  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    applyTheme(nextIsDark);
    notifyThemeListeners();
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Lightmode aktivieren" : "Darkmode aktivieren"}
      title={isDark ? "Lightmode aktivieren" : "Darkmode aktivieren"}
      className="relative inline-flex h-10 w-20 items-center rounded-full border border-indigo-100 bg-white/80 px-1 shadow-sm backdrop-blur-sm transition-colors hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-indigo-400"
    >
      <span className="absolute left-3 text-sm" aria-hidden="true">
        ☀️
      </span>
      <span className="absolute right-3 text-sm" aria-hidden="true">
        🌙
      </span>
      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm shadow-md transition-transform duration-200 ${
          isDark ? "translate-x-10" : "translate-x-0"
        }`}
        aria-hidden="true"
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
