import { useEffect, useRef, useState } from "react";

export const useFullscreenEnforcement = (onAutoSubmit) => {
  const [fullscreenViolations, setFullscreenViolations] = useState(0);
  const violationCount = useRef(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        violationCount.current += 1;
        setFullscreenViolations(violationCount.current);

        if (violationCount.current >= 3) {
          onAutoSubmit();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onAutoSubmit]);

  return {
    fullscreenViolations
  };
};
