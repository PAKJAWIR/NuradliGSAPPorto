import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useDevice } from "../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function TextHeadingAnimation({
  text,
  trigger,
  disableAnimation = false, // Cukup 1 prop boolean untuk kontrol aktifasi total
  // Props Konfigurasi Scroll
  startDesktop = "top center",
  endDesktop = "bottom center",
  scrubDesktop = true,
  startTablet,
  endTablet,
  scrubTablet,
  startMobile,
  endMobile,
  scrubMobile,
  // Utility Props
  markers = false,
  className = "",
  containerClassName = "",
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const { isMobile, isTablet, IsTablet } = useDevice();
  const activeTablet = isTablet || IsTablet;

  useGSAP(
    () => {
      if (!textRef.current || !containerRef.current || !text) return;

      // JIKA TRUE: Langsung bunuh animasi & bersihkan DOM menjadi teks biasa
      if (disableAnimation) {
        gsap.killTweensOf(textRef.current);
        gsap.set(textRef.current, { clearProps: "all" });
        return;
      }

      // Resolving GSAP Trigger element
      let resolvedTrigger = containerRef.current;
      if (trigger) {
        if (typeof trigger === "object" && "current" in trigger) {
          if (!trigger.current) return;
          resolvedTrigger = trigger.current;
        } else {
          resolvedTrigger = trigger;
        }
      }

      let split;

      try {
        // Fallback hirarki nilai scroll
        const activeStart = isMobile ? startMobile || startTablet || startDesktop : activeTablet ? startTablet || startDesktop : startDesktop;
        const activeEnd = isMobile ? endMobile || endTablet || endDesktop : activeTablet ? endTablet || endDesktop : endDesktop;
        const activeScrub = isMobile ? (scrubMobile ?? scrubTablet ?? scrubDesktop) : activeTablet ? (scrubTablet ?? scrubDesktop) : scrubDesktop;

        const isSmallDevice = isMobile || activeTablet;
        const headingSplitTypes = isSmallDevice ? "words" : "words, chars";

        // Split text
        split = new SplitType(textRef.current, {
          types: headingSplitTypes,
          tagName: "span",
        });

        const targets = isSmallDevice ? split.words : split.chars;

        // Base opacity
        gsap.set(targets, {
          opacity: isSmallDevice ? 0.15 : 0.18,
          willChange: "opacity",
        });

        // Animasi inti
        gsap.to(targets, {
          opacity: 1,
          stagger: isSmallDevice ? 0.08 : 0.004,
          ease: "none",
          force3D: true,
          lazy: true,
          scrollTrigger: {
            trigger: resolvedTrigger,
            endTrigger: isSmallDevice ? textRef.current : resolvedTrigger,
            start: activeStart,
            end: activeEnd,
            scrub: activeScrub,
            markers: markers,
          },
        });
      } catch (err) {
        console.error("❌ Error internal GSAP Text Animation:", err);
      }

      // Revert DOM saat unmount / ganti kondisi device
      return () => {
        if (split) split.revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [
        text,
        trigger,
        trigger?.current,
        markers,
        isMobile,
        activeTablet,
        disableAnimation, // Daftarkan kesini agar reaktif saat prop berubah
        startDesktop,
        startTablet,
        startMobile,
        endDesktop,
        endTablet,
        endMobile,
        scrubDesktop,
        scrubTablet,
        scrubMobile,
      ],
    },
  );

  return (
    <div ref={containerRef} className={`w-full h-full flex items-center justify-center ${containerClassName}`}>
      <h2 ref={textRef} className={`inline-block ${className}`}>
        {text}
      </h2>
    </div>
  );
}

export default TextHeadingAnimation;
