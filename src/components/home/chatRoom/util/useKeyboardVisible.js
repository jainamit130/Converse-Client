import { useState, useEffect } from "react";

const useKeyboardVisible = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  useEffect(() => {
    const threshold = 150; // Change if needed

    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight;
      setKeyboardVisible(heightDiff > threshold);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialHeight]);

  return keyboardVisible;
};

export default useKeyboardVisible;
