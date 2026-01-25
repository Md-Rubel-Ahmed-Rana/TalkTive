import { toast } from "sonner";

const getBrowserName = () => {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("chrome") && !ua.includes("edge") && !ua.includes("opr"))
    return "chrome";

  if (ua.includes("firefox")) return "firefox";

  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";

  if (ua.includes("edg")) return "edge";

  return "other";
};

export const openCookieSettings = () => {
  const browser = getBrowserName();

  const urlMap: Record<string, string> = {
    chrome: "chrome://settings/cookies",
    edge: "edge://settings/content/cookies",
    firefox: "about:preferences#privacy",
    safari: "",
    other: "",
  };

  const target = urlMap[browser];

  if (target) {
    window.open(target, "_blank");
  } else {
    toast.warning(
      "Please enable cookies manually from your browser settings.\n\nSafari → Settings > Privacy\nFirefox → Settings > Privacy\nChrome/Edge → Settings > Privacy & Cookies"
    );
  }
};
