import { useEffect, useRef, useState } from "react";
import { reportViolation } from "../../../services/student/studentService";
import { getSystemSettings } from "../../../services/admin/systemSettingsService";

export const useFullscreenEnforcement = (examId, onAutoSubmit) => {
  const [fullscreenViolations, setFullscreenViolations] = useState(0);
  const violationCount = useRef(0);

  useEffect(() => {
    const checkPolicyAndAttach = async () => {
      try {
        const settings = await getSystemSettings();
        if (!settings.fullscreenEnforcement) return;

        const handleFullscreenChange = async () => {
          if (!document.fullscreenElement) {
            violationCount.current += 1;
            setFullscreenViolations(violationCount.current);

            try {
              await reportViolation(examId, {
                type: "FULLSCREEN_EXIT",
                detail: `Fullscreen exit count: ${violationCount.current}`,
                timestamp: new Date().toISOString()
              });
            } catch (err) {
              console.error("Failed to report fullscreen violation:", err);
            }

            if (violationCount.current >= 3) {
              onAutoSubmit("Multiple fullscreen exits detected");
            }
          }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
      } catch (err) {
        console.error("Failed to fetch system policy:", err);
      }
    };

    checkPolicyAndAttach();
  }, [examId, onAutoSubmit]);

  return { fullscreenViolations };
};
