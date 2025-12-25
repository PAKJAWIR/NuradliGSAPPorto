import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";
import { HiOutlineArrowLongRight, HiOutlineArrowLongLeft } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";

const HoverArrow = forwardRef(
  (
    {
      text,
      link = "#",
      className = "",
      isOpen,

      splitType = "lines",
      duration = 1,
      stagger = 0.01,
      offsetY = 300,
    },
    ref
  ) => {
    const textRef = useRef(null);
    const arrowRef = useRef(null);
    const splitInstance = useRef(null);

    /** =============================
     * GSAP Setup
     * ============================= */
    useGSAP(
      () => {
        if (!textRef.current) return;

        splitInstance.current = new SplitType(textRef.current, {
          types: splitType,
        });

        const targets = splitInstance.current[splitType];

        gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
        gsap.set(arrowRef.current, {
          rotation: 0,
          yPercent: offsetY,
          autoAlpha: 0,
        });

        return () => {
          splitInstance.current?.revert();
          splitInstance.current = null;
        };
      },
      { scope: textRef }
    );

    /** =============================
     * Hover (arrow only)
     * ============================= */
    const mouseHover = () => {
      gsap.killTweensOf(arrowRef.current);
      gsap.to(arrowRef.current, {
        rotation: 45,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const mouseLeaveHover = () => {
      gsap.killTweensOf(arrowRef.current);
      gsap.to(arrowRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    };

    /** =============================
     * Reset when menu closed
     * ============================= */
    useEffect(() => {
      if (!isOpen && splitInstance.current) {
        const targets = splitInstance.current[splitType];
        gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
        gsap.set(arrowRef.current, {
          rotation: 0,
          yPercent: offsetY,
          autoAlpha: 0,
        });
      }
    }, [isOpen, splitType, offsetY]);

    /** =============================
     * Expose to Parent
     * ============================= */
    useImperativeHandle(ref, () => ({
      show: () => {
        if (!splitInstance.current) return;
        const targets = splitInstance.current[splitType];

        gsap.to(targets, {
          yPercent: 0,
          autoAlpha: 1,
          duration,
          ease: "power3.out",
          stagger,
        });

        gsap.to(arrowRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration,
          ease: "power3.out",
          delay: 0.1,
        });
      },

      hide: () => {
        if (!splitInstance.current) return;
        const targets = splitInstance.current[splitType];

        gsap.to(targets, {
          yPercent: offsetY,
          autoAlpha: 0,
          duration: duration * 0.6,
          ease: "power3.in",
          stagger,
        });

        gsap.to(arrowRef.current, {
          yPercent: offsetY,
          autoAlpha: 0,
          duration: duration * 0.6,
          ease: "power3.in",
        });
      },

      reset: () => {
        if (!splitInstance.current) return;
        const targets = splitInstance.current[splitType];

        gsap.set(targets, { yPercent: offsetY, autoAlpha: 0 });
        gsap.set(arrowRef.current, {
          rotation: 0,
          yPercent: offsetY,
          autoAlpha: 0,
        });
      },
    }));

    /** =============================
     * Render
     * ============================= */
    return (
      <Link to={link} onMouseEnter={mouseHover} onMouseLeave={mouseLeaveHover} className={`relative flex items-center gap-2 cursor-pointer w-22 h-fit ${className}`}>
        {text && (
          <span className="overflow-hidden block">
            <span ref={textRef} className="text-warna2">
              {text}
            </span>
          </span>
        )}

        <span className="overflow-hidden absolute right-0">
          <HiOutlineArrowLongRight ref={arrowRef} className="text-xl text-warna2 h-5 w-5" />
        </span>
      </Link>
    );
  }
);

export default HoverArrow;
