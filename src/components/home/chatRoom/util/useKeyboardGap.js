// useKeyboardGap.js
import { useEffect } from "react";

export default function useKeyboardGap() {
  useEffect(() => {
    /* initial viewport height (safe once component is mounted) */
    const initH = window.innerHeight;

    const onResize = () => {
      /* delta < 0  → keyboard opened,  delta ≥ 0 → closed */
      const delta = window.innerHeight - initH;

      /* expose the absolute gap as a CSS variable (positive px) */
      document.documentElement.style.setProperty(
        "--kb-gap",
        `${Math.abs(delta) + 45}px` // 45px = input bar height
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
}
