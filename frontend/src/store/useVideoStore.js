import { create } from "zustand"
export const useVideoStore = create((set, get) => ({
    scriptLoaded: false,
    scriptLoading: false,
    loadScript: async() => {


        const { scriptLoaded, scriptLoading } = get();
        if (scriptLoaded || scriptLoading) return;
        set({ scriptLoading: true });

        console.log("called load script function");

        const script = document.createElement("script");
        script.src = "https://8x8.vc/vpaas-magic-cookie-f169971450494886bab35a0d35a23cd9/external_api.js";
        script.async = false;
        console.log("reached here");
        script.onload = () => {
            console.log("External script loaded!");
            set({
                scriptLoading: false,
                scriptLoaded: true
            });
            document.body.appendChild(script);
        }
        script.onerror = () => {
            console.log(new Error("Script failed to load."));
            set({
                scriptLoading: false,
                scriptLoaded: false
            });
        };

    }
}))