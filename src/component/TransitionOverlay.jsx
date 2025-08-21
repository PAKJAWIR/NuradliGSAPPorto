import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

function TransitionOverlay() {
  const overlayRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const overlay = overlayRef.current;

    // animasi masuk (menutup halaman lama)
    const tl = gsap.timeline();
    tl.to(overlay, {
      scaleX: 1,
      transformOrigin: "left",
      duration: 0.1,
      ease: "power4.inOut",
    });

    // animasi keluar (membuka halaman baru)
    tl.to(overlay, {
      scaleX: 0,
      transformOrigin: "right",
      duration: 2,
      ease: "power4.inOut",
    });
  }, [location.pathname]); // trigger tiap kali route berubah
  return <div ref={overlayRef} className="fixed top-0 left-0 w-full h-full bg-warna2 z-50 scale-x-0"></div>;
}

export default TransitionOverlay;

