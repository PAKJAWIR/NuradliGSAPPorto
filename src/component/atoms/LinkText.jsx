import { useRef, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { useDevice } from "../../context/DeviceProvider";
import { Link } from "react-router-dom";

const LinkText = forwardRef(({ text, link, stagger = 0.1, duration = 1, className = "", splitType = "lines" }, ref) => {
  const textRef = useRef(null);
  const cloneRef = useRef(null);
  let splitInstance = null;

  const { isMobile } = useDevice();

  // =============================
  // Programmatic animations (PC + Mobile overlay)
  // =============================
  const anim = () => {
    if (splitInstance) splitInstance.revert();

    splitInstance = new SplitType(textRef.current, { types: splitType, tagName: "span" });
    const targets = splitInstance[splitType];

    gsap.set([textRef.current, cloneRef.current], { autoAlpha: 1 });

    gsap.from(targets, {
      y: "200%",
      duration,
      ease: "power2.out",
      autoAlpha: 0,
      stagger: stagger,
    });

    return () => splitInstance.revert();
  };

  const anim2 = () => {
    if (splitInstance) splitInstance.revert();

    splitInstance = new SplitType(textRef.current, { types: splitType, tagName: "span" });
    const targets = splitInstance[splitType];

    gsap.set([textRef.current, cloneRef.current], { autoAlpha: 1 });

    gsap.to(targets, {
      y: "200%",
      duration,
      ease: "power2.in",
      stagger: stagger,
      onComplete: () => gsap.set(textRef.current, { autoAlpha: 0 }),
    });

    return () => splitInstance.revert();
  };

  // =============================
  // Hover animations (PC only)
  // =============================
  const mouseEnter = () => {
    if (isMobile) return;

    gsap.to(textRef.current, {
      y: -textRef.current.offsetHeight,
      duration: 0.8,
      ease: "power1.out",
    });

    gsap.to(cloneRef.current, {
      y: -textRef.current.offsetHeight,
      duration: 0.8,
      ease: "power1.out",
    });
  };

  const mouseLeave = () => {
    if (isMobile) return;

    gsap.to([textRef.current, cloneRef.current], {
      y: 0,
      duration: 0.8,
      ease: "power4.out",
    });
  };

  useImperativeHandle(ref, () => ({
    animate: anim,
    animate2: anim2,
    element: textRef.current,
  }));

  useGSAP(
    () => {
      if (isMobile) {
        gsap.set([textRef.current, cloneRef.current], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set([textRef.current, cloneRef.current], { autoAlpha: 0 });
    },
    { scope: textRef }
  );

  return link ? (
    <Link onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} to={link} className={`relative flex w-fit overflow-hidden ${className} ${isMobile ? "pointer-events-auto" : ""}`}>
      <span ref={textRef} className="relative z-10 block overflow-hidden">
        {text}
      </span>
      <span ref={cloneRef} className="absolute left-0 top-full block overflow-hidden">
        {text}
      </span>
    </Link>
  ) : (
    <div ref={textRef} className={`inline-block overflow-hidden ${className}`}>
      {text}
    </div>
  );
});

export default LinkText;
