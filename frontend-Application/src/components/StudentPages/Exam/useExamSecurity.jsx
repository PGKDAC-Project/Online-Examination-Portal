import { useEffect, useRef, useState } from "react";
import { reportViolation } from "../../../services/student/studentService";
import { getSystemSettings } from "../../../services/admin/systemSettingsService";

export const useExamSecurity = (examId, onAutoSubmit) => {
  const [violations, setViolations] = useState(0);
  const tabSwitchCount = useRef(0);

  useEffect(() => {
    const checkPolicyAndAttach = async () => {
      try {
        const settings = await getSystemSettings();

        const notifyViolation = async (type, detail) => {
          try {
            await reportViolation(examId, { type, detail, timestamp: new Date().toISOString() });
            setViolations(v => v + 1);
          } catch (err) {
            console.error("Failed to report violation:", err);
          }
        };

        // Disable copy / paste / cut
        const blockCopyPaste = (e) => {
          e.preventDefault();
          notifyViolation("COPY_PASTE_ATTEMPT", `Attempted to ${e.type}`);
        };

        // Detect tab switch / window blur
        const handleVisibilityChange = () => {
          if (document.hidden && settings.tabSwitchDetection) {
            tabSwitchCount.current += 1;
            notifyViolation("TAB_SWITCH", `Tab switch count: ${tabSwitchCount.current}`);

            if (tabSwitchCount.current >= 3) {
              onAutoSubmit("Multiple tab switches detected");
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
      } catch (err) {
        console.error("Failed to fetch system policy:", err);
      }
    };

    checkPolicyAndAttach();
  }, [examId, onAutoSubmit]);

  return { violations, tabSwitchCountRef: tabSwitchCount };
};
