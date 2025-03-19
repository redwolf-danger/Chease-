import { create } from "zustand";


export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        const html_element = document.documentElement;
        html_element.setAttribute("data-theme", theme);
        // we can get the document element inside here too
        set({ theme });
    }
}));