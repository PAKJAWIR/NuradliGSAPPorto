import { createContext, useContext, useEffect, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  // Setup query media sesuai breakpoint Tailwind kamu
  const mediaQueries = {
    mobile: "(max-width: 767px)",
    tablet: "(min-width: 768px) and (max-width: 1279px)",
    desktop: "(min-width: 1280px)",
  };

  // Fungsi helper untuk mendapatkan state saat ini
  const getDeviceState = () => ({
    isMobile: window.matchMedia(mediaQueries.mobile).matches,
    isTablet: window.matchMedia(mediaQueries.tablet).matches, // Fix: gunakan t kecil sesuai standar
    isDesktop: window.matchMedia(mediaQueries.desktop).matches,
  });

  const [device, setDevice] = useState(getDeviceState);

  useEffect(() => {
    // Daftarkan listener ke masing-masing query
    const mobileQuery = window.matchMedia(mediaQueries.mobile);
    const tabletQuery = window.matchMedia(mediaQueries.tablet);
    const desktopQuery = window.matchMedia(mediaQueries.desktop);

    const handleChange = () => {
      setDevice(getDeviceState());
    };

    // Pasang listener (hanya terpicu saat breakpoint nyebrang garis batas)
    mobileQuery.addEventListener("change", handleChange);
    tabletQuery.addEventListener("change", handleChange);
    desktopQuery.addEventListener("change", handleChange);

    // Cleanup listeners
    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      tabletQuery.removeEventListener("change", handleChange);
      desktopQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>;
};

export const useDevice = () => useContext(DeviceContext);
