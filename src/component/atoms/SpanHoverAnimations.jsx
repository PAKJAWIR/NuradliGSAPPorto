import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDevice } from "../../context/DeviceProvider";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";

const SpanHoverAnimations = forwardRef(({ isClicked, onClick, className = "" }, ref) => {
  const spanRef = useRef(null);
  const span2Ref = useRef(null);
  const { isMobile } = useDevice();
  useGSAP(() => {});

  useImperativeHandle(ref, () => ({
    animateClose: () => {
      gsap.to(spanRef.current, { rotate: 0, duration: 0.4, ease: "power3.in" });
      gsap.to(span2Ref.current, { rotate: 0, duration: 0.4, ease: "power3.in" });
    },
    animateOpen: () => {
      gsap.to(spanRef.current, { rotate: -45, duration: 0.4, ease: "power2.out" });
      gsap.to(span2Ref.current, { rotate: 45, duration: 0.4, ease: "power2.out" });
    },
  }));

  // Hovering animation
  const mouseEnters = () => {
    if (isMobile) return;
    if (isClicked) return;
    gsap.to(spanRef.current, {
      y: 2,
      ease: "power2.out",
      duration: 0.4,
    });

    gsap.to(span2Ref.current, {
      y: -2,
      ease: "power2.out",
      duration: 0.4,
    });
  };
  const mouseLeaves = () => {
    if (isMobile) return;
    if (isClicked) return;
    gsap.to(spanRef.current, {
      y: -2,
      ease: "power2.out",
      duration: 0.4,
    });

    gsap.to(span2Ref.current, {
      y: 2,
      ease: "power2.out",
      duration: 0.4,
    });
  };

  useGSAP(
    () => {
      gsap.set(spanRef.current, { y: -2 });
      gsap.set(span2Ref.current, { y: 2 });

      // MOBILE ANIMATION
      gsap.to(spanRef.current, {
        rotate: isClicked ? -45 : 0,
        y: isClicked ? 0 : -2,
        duration: 0.4,
      });

      gsap.to(span2Ref.current, {
        rotate: isClicked ? 45 : 0,
        y: isClicked ? 0 : 2,
        duration: 0.4,
      });
    },
    { dependencies: [isClicked] }
  );

  return (
    <div className={className}>
      <button onClick={onClick} onMouseEnter={mouseEnters} onMouseLeave={mouseLeaves} className=" relative w-7 h-7 flex items-center justify-center">
        <span ref={spanRef} className="absolute w-6 h-[1.6px] bg-warna1"></span>
        <span ref={span2Ref} className="absolute w-6  h-[1.6px] bg-warna1"></span>
      </button>
    </div>
  );
});

export default SpanHoverAnimations;
