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
  const { isMobile } = useDevice();

  // ================= GSAP =================
  useGSAP(
    () => {
      // INITIAL OVERLAY STATE
      gsap.set([overlayDesktopRef.current, overlayMobileRef.current], {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      if (isMobile) return;

      // Trigger Pin
      const pinNav = ScrollTrigger.create({
        trigger: navRef.current,
        start: "bottom-=76 top",
        end: "max",
        pin: true,
        pinSpacing: true,
        markers: false,
        invalidateOnRefresh: true,
      });

      const pinDesktop = ScrollTrigger.create({
        trigger: desktopContainer.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: false,
        anticipatePin: 1,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      // CLEANUP (INI PENTING)
      return () => {
        pinNav.kill();
        pinDesktop.kill();
      };
    },
    { scope: desktopContainer },
  );

  // ================= OVERLAY HANDLER =================
  const overlayOnOffClick = (openState) => {
    const activeBtn = isMobile ? btnMobileRef.current : btnDesktopRef.current;
    const activeOverlay = isMobile ? overlayMobileRef.current : overlayDesktopRef.current;

    if (activeBtn?.isAnimating) return;

    isOverlayOpen.current = openState;

    gsap.to(activeOverlay, {
      autoAlpha: openState ? 1 : 0,
      pointerEvents: openState ? "auto" : "none",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // ================= IMPERATIVE API =================
  useImperativeHandle(ref, () => ({
    overlayOnOff: overlayOnOffClick,
    animateMove: (dir) => btnDesktopRef.current?.animateMove(dir),
  }));

  // ================= RENDER =================
  return (
    <>
      <nav>
        {/* DESKTOP OVERLAY */}
        <div
          ref={overlayDesktopRef}
          onClick={() => {
            overlayOnOffClick(false);
            btnDesktopRef.current?.closeMenu();
          }}
          className="hidden lg:block fixed inset-0 z-10 bg-warna2/30"
        />

        {/* MOBILE OVERLAY */}
        <div
          ref={overlayMobileRef}
          onClick={() => {
            overlayOnOffClick(false);
            btnMobileRef.current?.closeMenu();
          }}
          className="block lg:hidden fixed inset-0 z-10 bg-warna2/30 h-screen w-screen"
        />

        {/* ROOT UI LAYER */}
        <div className="fixed inset-0 w-screen h-screen z-30 pointer-events-none">
          {/* ================= MOBILE ================= */}
          {isMobile && (
            <div ref={mobileContainer} className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-5 right-5 pointer-events-auto">
                <ButtonNavMobile ref={btnMobileRef} onToggleOverlay={overlayOnOffClick} />
              </div>
            </div>
          )}

          {/* ================= DESKTOP ================= */}
          {!isMobile && (
            <div ref={desktopContainer} className="absolute inset-0 w-screen h-screen z-5">
              <div ref={navRef} className="absolute right-0 bottom-0 pointer-events-auto">
                <ButtonNav ref={btnDesktopRef} onToggleOverlay={overlayOnOffClick} />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
});

export default Navbar;
