import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

const InfoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 text-sm flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <span>
          This site is hosted on a free server. It may take up to a minute to
          respond after inactivity due to server spin-down or server wake up.
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-yellow-700 hover:text-yellow-900 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default InfoBanner;
