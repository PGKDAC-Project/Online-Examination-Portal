import { useEffect, useRef, useState } from "react";

export const useExamSecurity = (onAutoSubmit) => {
  const [violations, setViolations] = useState(0);
  const tabSwitchCount = useRef(0);

  useEffect(() => {
    // Disable copy / paste / cut
    const blockCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy / Paste is disabled during the exam");
      setViolations(v => v + 1);
    };

    // Detect tab switch / window blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1;
        setViolations(v => v + 1);

        if (tabSwitchCount.current >= 3) {
          alert("You switched tabs multiple times. Exam will be auto-submitted.");
          onAutoSubmit();
        }
      }
    };

    document.addEventListener("copy", blockCopyPaste);
    document.addEventListener("paste", blockCopyPaste);
    document.addEventListener("cut", blockCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("copy", blockCopyPaste);
      document.removeEventListener("paste", blockCopyPaste);
      document.removeEventListener("cut", blockCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onAutoSubmit]);
 
   return { violations, tabSwitchCountRef: tabSwitchCount };
};
