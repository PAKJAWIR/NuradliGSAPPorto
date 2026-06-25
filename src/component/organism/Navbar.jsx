import { useRef, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ButtonNav from "../molecules/ButtonNav/ButtonNav";
import ButtonNavMobile from "../molecules/ButtonNav/ButtonNavMobile";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

const Navbar = forwardRef((_, ref) => {
  // ================= REFS =================
  const desktopContainer = useRef(null);
  const mobileContainer = useRef(null);
  const navRef = useRef(null);
  const btnDesktopRef = useRef(null);
  const btnMobileRef = useRef(null);
  const overlayDesktopRef = useRef(null);
  const overlayMobileRef = useRef(null);
  const isOverlayOpen = useRef(false);

  // ================= DEVICE =================
  const { isMobile, isTablet } = useDevice();
  const isTouchDevice = isMobile || isTablet;

  // ================= GSAP =================
  useGSAP(
    () => {
      gsap.set([overlayDesktopRef.current, overlayMobileRef.current], {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      if (isTouchDevice) return;

      // ================= NAV PIN =================
      const pinNav = ScrollTrigger.create({
        trigger: navRef.current,
        start: "bottom-=76 top",
        end: "max",
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });

      // ================= DESKTOP SCROLL =================
      const pinDesktop = ScrollTrigger.create({
        trigger: desktopContainer.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        // FIX: Hapus anticipatePin dan pinSpacing karena pin-nya false
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      // FIX: Hapus requestAnimationFrame(() => ScrollTrigger.refresh())
      // Biarkan GSAP yang mengatur refresh cycle secara natural saat load selesai

      return () => {
        pinNav.kill();
        pinDesktop.kill();
      };
    },
    {
      scope: desktopContainer,
      dependencies: [isTouchDevice],
    },
  );

  // ================= OVERLAY HANDLER =================
  const overlayOnOffClick = (openState) => {
    const activeBtn = isTouchDevice ? btnMobileRef.current : btnDesktopRef.current;
    const activeOverlay = isTouchDevice ? overlayMobileRef.current : overlayDesktopRef.current;

    if (activeBtn?.isAnimating) return;

    isOverlayOpen.current = openState;

    gsap.to(activeOverlay, {
      autoAlpha: openState ? 1 : 0,
      pointerEvents: openState ? "auto" : "none",
      duration: 1,
      ease: "power3.out",
      lazy: true, // OPTIMASI: Defer read/write DOM
    });
  };

  // ================= IMPERATIVE API =================
  useImperativeHandle(ref, () => ({
    overlayOnOff: overlayOnOffClick,
    animateMove: (dir) => btnDesktopRef.current?.animateMove(dir),
  }));

  // ================= RENDER =================
  return (
    <nav>
      <div
        ref={overlayDesktopRef}
        onClick={() => {
          overlayOnOffClick(false);
          btnDesktopRef.current?.closeMenu();
        }}
        className="hidden lg:block fixed inset-0 z-10 bg-warna2/40"
      />

      <div
        ref={overlayMobileRef}
        onClick={() => {
          overlayOnOffClick(false);
          btnMobileRef.current?.closeMenu();
        }}
        className="block lg:hidden fixed inset-0 z-10 h-screen w-screen bg-warna2/30"
      />

      <div className="fixed inset-0 z-30 h-dvh w-screen pointer-events-none">
        {isTouchDevice && (
          <div ref={mobileContainer} className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-5 right-5 pointer-events-auto">
              <ButtonNavMobile ref={btnMobileRef} onToggleOverlay={overlayOnOffClick} />
            </div>
          </div>
        )}

        {!isTouchDevice && (
          <div ref={desktopContainer} className="absolute inset-0 z-5 h-screen w-screen">
            <div ref={navRef} className="absolute bottom-0 right-0 pointer-events-auto">
              <ButtonNav ref={btnDesktopRef} onToggleOverlay={overlayOnOffClick} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;
