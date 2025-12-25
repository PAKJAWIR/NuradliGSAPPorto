// Navbar.jsx
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonNav from "../molecules/ButtonNav";
import ButtonNavMobile from "../molecules/ButtonNavMobile";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

const Navbar = forwardRef((_, ref) => {
  const container = useRef(null);
  const navRef = useRef(null);
  const btnDesktopRef = useRef(null);
  const btnMobileRef = useRef(null);
  const overlayClick = useRef(null);
  const isOverlayOpen = useRef(false);
  const { isMobile } = useDevice();

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: navRef.current,
        start: "bottom-=80 top",
        end: "+=5000",
        pin: true,
        pinSpacing: false,
      });

      gsap.set(overlayClick.current, { autoAlpha: 0 });
    },
    { scope: container }
  );

  const overlayOnOffClick = (openState) => {
    const activeBtn = btnDesktopRef.current || btnMobileRef.current;
    if (activeBtn?.isAnimating) return;

    isOverlayOpen.current = openState;

    gsap.to(overlayClick.current, {
      autoAlpha: openState ? 1 : 0,
      opacity: openState ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useImperativeHandle(ref, () => ({
    overlayOnOff: overlayOnOffClick,
    animateMove: (dir) => btnDesktopRef.current?.animateMove(dir),
  }));

  return (
    <div ref={container} className="w-fit h-fit md:w-screen md:h-screen fixed inset-0 z-3 md:z-1">
      {/* GLOBAL OVERLAY */}
      <div
        ref={overlayClick}
        onClick={() => {
          overlayOnOffClick(false);
          btnDesktopRef.current?.closeMenu();
          btnMobileRef.current?.closeMenu();
        }}
        className={'fixed inset-0 z-1 bg-warna2/30 ${isMobile ? "w-screen h-screen fixed" : ""}'}
      />

      {/* MOBILE NAV */}
      <div className="fixed bottom-5 right-5 z-20 block md:hidden">
        <ButtonNavMobile ref={btnMobileRef} onToggleOverlay={overlayOnOffClick} />
      </div>

      {/* DESKTOP NAV */}
      <div ref={navRef} className="absolute bottom-0 right-0 z-20 hidden md:block">
        <ButtonNav ref={btnDesktopRef} onToggleOverlay={overlayOnOffClick} />
      </div>
    </div>
  );
});

export default Navbar;
