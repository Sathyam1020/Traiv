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

/** Light is the only product appearance; ignore older saved preferences. */
function storedTheme(): Theme {
  return "light";
}

function persist() {
  try {
    window.localStorage.setItem(THEME_KEY, "light");
  } catch {
    // Blocked storage must not prevent the light appearance.
  }
  document.documentElement.classList.remove("dark");
}

/**
 * A factory, not a module-level store.
 *
 * A global store on the server is shared across concurrent requests, so one user's state
 * can leak into another's response. The provider creates one instance per render tree.
 */
export const createUiStore = (init: UiState = { theme: "light", studioId: null }) =>
  createStore<UiStore>()((set, get) => ({
    ...init,
    theme: "light",
    setTheme: () => {
      persist();
      set({ theme: "light" });
    },
    setStudioId: (studioId) => set({ studioId }),
    toggleTheme: () => get().setTheme("light"),
  }));

export { storedTheme };
