import React, { useRef, useEffect } from "react";

const ScrollToBottom = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView();
    }
  });

  return <div ref={elementRef} />;
};

export default ScrollToBottom;
