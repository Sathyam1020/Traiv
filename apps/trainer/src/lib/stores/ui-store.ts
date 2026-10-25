import { createStore } from "zustand/vanilla";

export type Theme = "light" | "dark";

/**
 * `studioId` is per tab on purpose.
 *
 * The session carries one active studio for the whole browser, so two tabs on different
 * studios would both write to whichever was switched to last — and the membership check
 * would pass, because the coach belongs to both. Keeping it here means each tab sends its
 * own studio with every request.
 */
export type UiState = { theme: Theme; studioId: string | null };
export type UiActions = {
  setTheme: (theme: Theme) => void;
  setStudioId: (studioId: string | null) => void;
  toggleTheme: () => void;
};
export type UiStore = UiState & UiActions;

const THEME_KEY = "traiv.theme";

/**
 * Read once on the client. On the server there is no preference to read.
 *
 * Dark unless the person has chosen light (ADR 0022). The OS setting is deliberately not
 * consulted: dark is the product's own appearance, and light is the alternative a person
 * picks — on a phone in direct sun, say — rather than the one they are handed.
 */
function storedTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  } catch {
    // Private windows and blocked site data both throw here.
    return "dark";
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
export const createUiStore = (init: UiState = { theme: "dark", studioId: null }) =>
  createStore<UiStore>()((set, get) => ({
    ...init,
    setTheme: (theme) => {
      persist(theme);
      set({ theme });
    },
    setStudioId: (studioId) => set({ studioId }),
    toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  }));

export { storedTheme };
