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
      gsap.to(spanRef.current, { rotate: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(span2Ref.current, { rotate: 90, duration: 0.3, ease: "power2.out" });
    },
    animateOpen: () => {
      gsap.to(spanRef.current, { rotate: 45, duration: 0.3, ease: "power2.out" });
      gsap.to(span2Ref.current, { rotate: 135, duration: 0.3, ease: "power2.out" });
    },
  }));

  // Hovering animation
  const mouseEnters = () => {
    if (isMobile) return;
    if (isClicked) return;
    gsap.to(spanRef.current, {
      rotate: 90,
      ease: "power2.out",
      duration: 0.3,
    });

    gsap.to(span2Ref.current, {
      rotate: 180,
      ease: "power2.out",
      duration: 0.3,
    });
  };
  const mouseLeaves = () => {
    if (isMobile) return;
    if (isClicked) return;
    gsap.to(spanRef.current, {
      rotate: 0,
      ease: "power2.out",
      duration: 0.3,
    });

    gsap.to(span2Ref.current, {
      rotate: 90,
      ease: "power2.out",
      duration: 0.3,
    });
  };

  useGSAP(
    () => {
      if (!isMobile && !isClicked) return;

      gsap.to(spanRef.current, {
        rotate: isClicked ? 45 : 90,
        ease: "power2.out",
        duration: 0.3,
      });

      gsap.to(span2Ref.current, {
        rotate: isClicked ? 135 : 180,
        ease: "power2.out",
        duration: 0.3,
      });
    },
    { dependencies: [isClicked] }
  );

  return (
    <div className={className}>
      <button onClick={onClick} onMouseEnter={mouseEnters} onMouseLeave={mouseLeaves} className="relative overflow-hidden smooth-item cursor-pointer flex items-center justify-center w-5 h-5">
        <span ref={spanRef} className="absolute w-4.5 h-0.5 bg-warna1 "></span>
        <span ref={span2Ref} className="absolute w-4.5 h-0.5 bg-warna1  rotate-90"></span>
      </button>
    </div>
  );
});

export default SpanHoverAnimations;
