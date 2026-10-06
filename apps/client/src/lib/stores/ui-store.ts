import { createStore } from "zustand/vanilla";

export type Theme = "light" | "dark";

export type UiState = { theme: Theme };
export type UiActions = {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};
export type UiStore = UiState & UiActions;

const THEME_KEY = "traiv.theme";

/** Read once on the client. On the server there is no preference to read. */
function storedTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    // Private windows and blocked site data both throw here.
    return "light";
  }
}

function persist(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // A remembered theme is a convenience, not a requirement.
  }
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * A factory, not a module-level store.
 *
 * A global store on the server is shared across concurrent requests, so one user's state
 * can leak into another's response. The provider creates one instance per render tree.
 */
export const createUiStore = (init: UiState = { theme: "light" }) =>
  createStore<UiStore>()((set, get) => ({
    ...init,
    setTheme: (theme) => {
      persist(theme);
      set({ theme });
    },
    toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  }));

export { storedTheme };
