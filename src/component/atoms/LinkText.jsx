import { useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { useDevice } from "../../context/DeviceProvider";
import { Link } from "react-router-dom";

const LinkText = forwardRef(
  (
    {
      as: Component = "span",
      text,
      link,
      stagger = 0.1,
      staggerBack = -0.1,
      duration = 1,
      offsetY = 300,
      className = "",
      splitType = "lines",
      enableAnimation = true,
      enableOpacity = true, // NEW
    },
    ref,
  ) => {
    const textRef = useRef(null);
    const cloneRef = useRef(null);
    const splitInstance = useRef(null);

    const { isMobile } = useDevice();

    const shouldAnimate = enableAnimation;

    const getAlpha = () => (enableOpacity ? 0 : 1);

    /* =============================
       OPEN ANIMATION
    ============================= */
    const anim = () => {
      if (!shouldAnimate) return;

      splitInstance.current?.revert();

      splitInstance.current = new SplitType(textRef.current, {
        types: splitType,
        tagName: Component,
        lineClass: "split-line",
      });

      const targets = splitInstance.current[splitType];

      gsap.set(targets, { yPercent: offsetY, autoAlpha: getAlpha() });
      gsap.set([textRef.current, cloneRef.current], { autoAlpha: 1 });

      gsap.to(targets, {
        yPercent: 0,
        duration,
        ease: "power2.out",
        autoAlpha: 1,
        stagger,
      });
    };

    /* =============================
       CLOSE ANIMATION
    ============================= */
    const anim2 = () => {
      if (!shouldAnimate) return;

      splitInstance.current?.revert();

      splitInstance.current = new SplitType(textRef.current, {
        types: splitType,
        tagName: Component,
        lineClass: "split-line",
      });

      const targets = splitInstance.current[splitType];

      gsap.set(targets, { yPercent: 0, autoAlpha: 1 });

      gsap.to(targets, {
        yPercent: offsetY,
        duration,
        ease: "power2.in",
        stagger: staggerBack,
        autoAlpha: enableOpacity ? 0 : 1,
        onComplete: () => gsap.set(textRef.current, { autoAlpha: enableOpacity ? 0 : 1 }),
      });
    };

    /* =============================
       SPLIT INITIALIZATION
    ============================= */
    useEffect(() => {
      if (!textRef.current) return;

      if (splitInstance.current) {
        splitInstance.current.revert();
      }

      if (!shouldAnimate) {
        gsap.set(textRef.current, {
          clearProps: "all",
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      splitInstance.current = new SplitType(textRef.current, {
        types: splitType,
        tagName: Component,
        lineClass: "split-line",
      });

      const targets = splitInstance.current[splitType];
      gsap.set(targets, { yPercent: offsetY, autoAlpha: getAlpha() });
    }, [text, shouldAnimate, enableOpacity]);

    /* =============================
       HOVER (DESKTOP ONLY)
    ============================= */
    const mouseEnter = () => {
      if (!shouldAnimate) return;

      gsap.to([textRef.current, cloneRef.current], {
        yPercent: -100,
        duration: 0.8,
        ease: "power1.out",
      });
    };

    const mouseLeave = () => {
      if (!shouldAnimate) return;

      gsap.to([textRef.current, cloneRef.current], {
        yPercent: 0,
        duration: 0.8,
        ease: "power4.out",
      });
    };

    useImperativeHandle(ref, () => ({
      animate: anim,
      animate2: anim2,
      element: textRef.current,
    }));

    /* =============================
       BASELINE VISIBILITY
    ============================= */
    useGSAP(
      () => {
        if (!shouldAnimate) {
          gsap.set(textRef.current, { autoAlpha: 1 });
          return;
        }

        gsap.set([textRef.current, cloneRef.current], {
          autoAlpha: enableOpacity ? 0 : 1,
        });
      },
      { scope: textRef },
    );

    return link ? (
      <Link onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} to={link} className={`relative flex w-fit overflow-hidden ${className}`}>
        <Component ref={textRef} className="relative z-10 block overflow-hidden">
          {text}
        </Component>
        <Component ref={cloneRef} className="absolute left-0 top-full block overflow-hidden">
          {text}
        </Component>
      </Link>
    ) : (
      <Component ref={textRef} className={`inline-block h-fit overflow-hidden ${className}`}>
        {text}
      </Component>
    );
  },
);

export default LinkText;
