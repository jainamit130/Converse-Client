import React, { useRef, useEffect } from "react";

const ScrollToBottom = ({ chatRoomId, messages }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView();
    }
  }, [chatRoomId, messages]);

  return <div ref={elementRef} />;
};

export default ScrollToBottom;
