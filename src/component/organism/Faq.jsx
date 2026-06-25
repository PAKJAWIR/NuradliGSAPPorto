import { useRef } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useDevice } from "../../context/DeviceProvider";
import { useFaq } from "../../context/FaqContext";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONSTANTS
// ==========================================
const CLIP_PATHS = {
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  full: "inset(0% 0% 0% 0%)",
};

const ANIM_CONFIG = {
  ease: "power3.out",
  enterDuration: 0.45,
  leaveDuration: 0.35,
  scrollEnterDuration: 0.6,
  scrollLeaveDuration: 0.8,
};

function Faq() {
  const { faqs, activeIndex, openFaq } = useFaq();
  const { isMobile, isTablet } = useDevice();

  // Flags & States
  const enableHover = !isMobile && !isTablet;
  const enableScrollTrigger = isMobile || isTablet;

  const activeTriggerIndex = useRef(-1);
  const lastIndex = useRef(-1);

  // DOM Refs
  const itemsRef = useRef([]);
  const overlayRefs = useRef([]);

  const { contextSafe } = useGSAP();

  // ==========================================
  // MOBILE + TABLET: SCROLLTRIGGER
  // ==========================================
  useGSAP(
    () => {
      if (faqs.length === 0) return;

      // Reset state based on device capability
      gsap.set(overlayRefs.current, {
        scaleY: enableScrollTrigger ? 1 : 0,
        clipPath: enableScrollTrigger ? CLIP_PATHS.top : "none",
        autoAlpha: 1,
      });

      if (!enableScrollTrigger) return;

      const triggers = [];

      overlayRefs.current.forEach((overlay, index) => {
        const item = itemsRef.current[index];
        if (!overlay || !item) return;

        const trigger = ScrollTrigger.create({
          trigger: item,
          start: "top center-=10%",
          end: "bottom center-=10%",

          onEnter: () => {
            activeTriggerIndex.current = index;
            gsap.fromTo(overlay, { clipPath: CLIP_PATHS.top }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.scrollEnterDuration, ease: ANIM_CONFIG.ease, overwrite: "auto" });
            lastIndex.current = index;
          },
          onLeave: () => {
            gsap.to(overlay, { clipPath: CLIP_PATHS.bottom, duration: ANIM_CONFIG.scrollLeaveDuration, ease: ANIM_CONFIG.ease, overwrite: "auto" });
          },
          onEnterBack: () => {
            activeTriggerIndex.current = index;
            gsap.fromTo(overlay, { clipPath: CLIP_PATHS.bottom }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.scrollLeaveDuration, ease: ANIM_CONFIG.ease, overwrite: "auto" });
            lastIndex.current = index;
          },
          onLeaveBack: () => {
            gsap.to(overlay, { clipPath: CLIP_PATHS.top, duration: ANIM_CONFIG.scrollEnterDuration, ease: ANIM_CONFIG.ease, overwrite: "auto" });
          },
        });

        triggers.push(trigger);
      });

      ScrollTrigger.refresh();
      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [enableScrollTrigger, faqs] },
  );

  // ==========================================
  // DESKTOP: UNIFIED HOVER HANDLER (Enter & Leave)
  // ==========================================
  const handleHover = contextSafe((index, e) => {
    if (!enableHover) return;

    const overlay = overlayRefs.current[index];
    const item = itemsRef.current[index];
    if (!overlay || !item) return;

    // 1. Kalkulasi arah detektor mouse (Cukup tulis sekali di sini)
    const rect = item.getBoundingClientRect();
    const isFromTop = e.clientY < rect.top + rect.height / 2;
    const targetClipPath = isFromTop ? CLIP_PATHS.top : CLIP_PATHS.bottom;

    // 2. Cabang logika berdasarkan tipe event mouse
    if (e.type === "mouseenter") {
      gsap.set(overlay, { scaleY: 1 });
      gsap.fromTo(overlay, { clipPath: targetClipPath }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.enterDuration, ease: ANIM_CONFIG.ease, overwrite: "auto" });
    } else if (e.type === "mouseleave") {
      gsap.to(overlay, {
        clipPath: targetClipPath,
        duration: ANIM_CONFIG.leaveDuration,
        ease: ANIM_CONFIG.ease,
        overwrite: "auto",
      });
    }
  });

  return (
    <section className="flex items-start justify-center h-svh md:h-fit lg:h-screen w-screen p-4 md:p-6 bg-warna1">
      <div className="flex flex-col md:gap-8 items-center justify-around md:justify-center lg:flex-row h-full w-full">
        {/* TITLE SECTION */}
        <div className="flex flex-col items-start justify-start md:justify-end h-[28vh] md:h-[20vh] lg:h-full w-full">
          <div className="flex items-center md:items-start lg:items-center justify-start h-1/3 md:h-1/2 w-full">
            <h2 className="text-sm uppercase text-warna2 font-bold">FAQ</h2>
          </div>
          <div className="flex flex-col gap-12 h-1/2 md:h-full w-full">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Have any questions?</h2>
            <p className="text-xs md:text-sm w-[80%] md:w-[50%]">
              If something sparks your curiosity, feel free to ask. Whether it is about my process, collaborations, or technical details behind the work, I am always open to thoughtful conversations.
            </p>
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="flex flex-col items-center justify-center h-[54svh] md:h-[40svh] lg:h-full w-full">
          {faqs.map((faq, index) => (
            <button
              key={faq.id || index}
              ref={(el) => (itemsRef.current[index] = el)}
              onClick={() => openFaq(index)}
              onMouseEnter={(e) => handleHover(index, e)}
              onMouseLeave={(e) => handleHover(index, e)}
              className="relative z-1 flex items-center justify-between h-16 w-full overflow-hidden bg-warna1 p-2 lg:p-6 cursor-pointer"
            >
              {/* OVERLAY */}
              <div ref={(el) => (overlayRefs.current[index] = el)} className="absolute inset-0 z-0 bg-warna3" />

              {/* CONTENT */}
              <h2 className="relative z-10 text-sm md:text-lg font-bold">{faq.title}</h2>
              <Plus size={20} strokeWidth={2} className={`relative z-10 transition-transform duration-500 ${activeIndex === index ? "rotate-45" : "rotate-0"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
