import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";
import { HiArrowLongRight, HiArrowLongLeft } from "react-icons/hi2";

const HoverArrow = forwardRef(({ direction = "right", text, link = "#", className = "", isOpen, as: Component = "span", splitType = "lines", duration = 1, stagger = 0.01, offsetY = 300, enableAnimation = true }, ref) => {
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const splitInstance = useRef(null);

  const shouldAnimate = enableAnimation;

  const isArrowTop = direction === "left";
  const ArrowIcon = direction === "right" ? HiArrowLongRight : HiArrowLongLeft;

  useGSAP(
    () => {
      if (!shouldAnimate) return;
      if (!textRef.current) return;

      splitInstance.current = new SplitType(textRef.current, { types: splitType });
      const targets = splitInstance.current[splitType];

      gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
      gsap.set(arrowRef.current, { rotation: 0, yPercent: offsetY, autoAlpha: 0 });

      return () => {
        splitInstance.current?.revert();
        splitInstance.current = null;
      };
    },
    { scope: textRef },
  );

  useImperativeHandle(ref, () => ({
    show: () => {
      if (!splitInstance.current && !shouldAnimate) return;
      const targets = splitInstance.current[splitType];
      gsap.to(targets, { yPercent: 0, autoAlpha: 1, duration, ease: "power2.out", stagger });
      gsap.to(arrowRef.current, { yPercent: 0, autoAlpha: 1, duration, ease: "power2.out", delay: 0.1 });
    },
    hide: () => {
      if (splitInstance.current && !shouldAnimate) return;
      const targets = splitInstance.current[splitType];
      gsap.to(targets, { yPercent: offsetY, autoAlpha: 0, duration: duration, ease: "power2.in", stagger });
      gsap.to(arrowRef.current, { yPercent: offsetY, autoAlpha: 0, duration: duration, ease: "power2.in" });
    },
    reset: () => {
      if (splitInstance.current && !shouldAnimate) return;
      const targets = splitInstance.current[splitType];
      gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
      gsap.set(arrowRef.current, { rotation: 0, yPercent: offsetY, autoAlpha: 0 });
    },
  }));

  const mouseHover = () => {
    gsap.killTweensOf(arrowRef.current);
    gsap.to(arrowRef.current, {
      rotation: direction === "left" ? -45 : 45,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const mouseLeaveHover = () => {
    gsap.killTweensOf(arrowRef.current);
    gsap.to(arrowRef.current, { rotation: 0, duration: 0.4, ease: "power2.inOut" });
  };

  useEffect(() => {
    if (!shouldAnimate) return;
    if (!isOpen && splitInstance.current) {
      const targets = splitInstance.current[splitType];
      gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
      gsap.set(arrowRef.current, { rotation: 0, yPercent: offsetY, autoAlpha: 0 });
    }
  }, [isOpen, splitType, offsetY]);

  return (
    <div onMouseEnter={mouseHover} onMouseLeave={mouseLeaveHover} className={`relative flex items-center gap-2 cursor-pointer w-fit ${className}`}>
      {isArrowTop && (
        <span className="overflow-hidden ">
          <ArrowIcon ref={arrowRef} className=" text-lg will-change-transform backface-hidden" />
        </span>
      )}
      {text && (
        <span className="overflow-hidden ">
          <Component ref={textRef} className="">
            {text}
          </Component>
        </span>
      )}
      {!isArrowTop && (
        <span className="overflow-hidden  ">
          <ArrowIcon ref={arrowRef} className="text-lg will-change-transform backface-hidden" />
        </span>
      )}
    </div>
  );
});

export default HoverArrow;
