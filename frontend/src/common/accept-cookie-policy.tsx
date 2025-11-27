import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/utils/cookie-policy";
import { useThirdPartyCookieCheck } from "@/hooks/useThirdPartyCookieCheck";

const AcceptCookiePolicy = () => {
  const cookiesWorking = useThirdPartyCookieCheck();

  if (cookiesWorking === null) return null;

  if (cookiesWorking === true) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Enable Cookies to Continue
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Talktive requires third-party cookies to keep you securely logged in.
          <br />
          Please enable cookies in your browser settings to continue using the
          app.
        </p>

        <Button className="px-6 py-2" onClick={openCookieSettings}>
          Open Cookie Settings
        </Button>

        <p className="mt-4 text-xs text-gray-400">
          We never use cookies for ads or tracking — only for authentication.
        </p>
      </div>
    </div>
  );
};

export default AcceptCookiePolicy;
