import { useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useFaq } from "../context/FaqContext";
import gsap from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

// =============================================================================
// ANIMATION CONFIGURATION
// =============================================================================
const ANIM_CONFIG = {
  duration: {
    overlayIn: 0.8,
    overlayOut: 0.4,
    modalIn: 1.2,
    modalOut: 0.6,
    textIn: 0.8,
    textOut: 0.4,
    buttonIn: 1.0,
    buttonOut: 1.0,
  },
  ease: {
    out: "power3.out",
    in: "power4.in",
    overlayOut: "power2.in",
  },
  stagger: {
    label: 0.15,
    number: 0.5,
    title: 0.015,
    desc: 0.008,
  },
};

// =============================================================================
// DOM UTILITIES
// =============================================================================
const wrapLinesInContainer = (lines) => {
  lines?.forEach((line) => {
    if (line.parentElement?.classList.contains("line-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "line-wrapper";
    wrapper.style.overflow = "hidden";

    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });
};

function FaqDetails() {
  // --- Context Hooks ---
  const { faqs, activeIndex, closeFaq, openFaq, setIsFaqsFullyLoaded, loading } = useFaq();

  const faq = activeIndex !== null && faqs?.length ? faqs[activeIndex] : null;

  // --- UI Container Refs ---
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const buttonsRef = useRef(null);

  // --- Text Element Refs ---
  const faqLabelRef = useRef(null);
  const numberRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  // --- Animation & Split Tracker Refs ---
  const splitRefs = useRef({ faqLabel: null, number: null, title: null, desc: null });
  const activeTimelineRef = useRef(null);
  const isClosingRef = useRef(false);
  const isModalOpenRef = useRef(false);
  const isIntroPlayingRef = useRef(false); // Track apakah intro pertama sedang jalan

  // =============================================================================
  // REUSABLE ANIMATION TIMELINES
  // =============================================================================
  const playContentExitAnimation = (onCompleteCallback) => {
    const numberChars = splitRefs.current.number?.chars || [];
    const titleWords = splitRefs.current.title?.words || [];
    const descWords = splitRefs.current.desc?.words || [];

    const exitTl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: onCompleteCallback,
    });

    exitTl
      .to(numberChars, { yPercent: 120, opacity: 0, duration: ANIM_CONFIG.duration.textOut, stagger: -ANIM_CONFIG.stagger.number, ease: ANIM_CONFIG.ease.in }, 0)
      .to(titleWords, { yPercent: 120, opacity: 0, duration: ANIM_CONFIG.duration.textOut + 0.05, stagger: ANIM_CONFIG.stagger.title, ease: ANIM_CONFIG.ease.in }, "-=0.225")
      .to(descWords, { yPercent: 120, opacity: 0, duration: ANIM_CONFIG.duration.textOut, stagger: ANIM_CONFIG.stagger.desc, ease: ANIM_CONFIG.ease.in }, "-=0.4");

    return exitTl;
  };

  // =============================================================================
  // MAIN ENTER/UPDATE ANIMATION EFFECT
  // =============================================================================
  useGSAP(
    () => {
      if (activeIndex === null || !faq) {
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";

      // 1. Reset SplitType lama
      splitRefs.current.number?.revert();
      splitRefs.current.title?.revert();
      splitRefs.current.desc?.revert();

      // 2. Inisialisasi SplitType Baru
      splitRefs.current.number = new SplitType(numberRef.current, { types: "chars" });
      splitRefs.current.title = new SplitType(titleRef.current, { types: "lines, words", lineClass: "split-line", wordClass: "split-word" });
      splitRefs.current.desc = new SplitType(descRef.current, { types: "lines, words", lineClass: "split-line", wordClass: "split-word" });

      // 3. Terapkan Masking Line Wrapper
      wrapLinesInContainer(splitRefs.current.title.lines);
      wrapLinesInContainer(splitRefs.current.desc.lines);

      const numberChars = splitRefs.current.number.chars || [];
      const titleWords = splitRefs.current.title.words || [];
      const descWords = splitRefs.current.desc.words || [];

      gsap.set([...numberChars, ...titleWords, ...descWords], {
        yPercent: 120,
        opacity: 0,
        willChange: "transform",
      });

      const mainTl = gsap.timeline({ defaults: { overwrite: "auto" } });

      // KONDISI A: Intro Pertama Kali Modal Dibuka
      if (!isModalOpenRef.current) {
        isIntroPlayingRef.current = true; // Set flag intro aktif

        splitRefs.current.faqLabel = new SplitType(faqLabelRef.current, { types: "chars" });
        const faqChars = splitRefs.current.faqLabel.chars || [];

        gsap.set(faqChars, { yPercent: 120, opacity: 0, willChange: "transform" });
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { x: "-100%", force3D: true });
        gsap.set(buttonsRef.current, { y: 100 });

        mainTl
          .to(overlayRef.current, { opacity: 1, duration: ANIM_CONFIG.duration.overlayIn, ease: ANIM_CONFIG.ease.out })
          .to(modalRef.current, { x: "0%", duration: ANIM_CONFIG.duration.modalIn, ease: ANIM_CONFIG.ease.out, onComplete: () => setIsFaqsFullyLoaded(true) }, "-=0.4")
          .to(faqChars, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn, stagger: ANIM_CONFIG.stagger.label, ease: ANIM_CONFIG.ease.out }, "-=0.8")
          .to(numberChars, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn, stagger: ANIM_CONFIG.stagger.number, ease: ANIM_CONFIG.ease.out }, "-=0.55")
          .to(titleWords, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn + 0.2, stagger: ANIM_CONFIG.stagger.title, ease: ANIM_CONFIG.ease.out }, "-=0.45")
          .to(descWords, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn, stagger: ANIM_CONFIG.stagger.desc, ease: ANIM_CONFIG.ease.out }, "-=0.8")
          .to(buttonsRef.current, { y: 0, duration: ANIM_CONFIG.duration.buttonIn, ease: ANIM_CONFIG.ease.out }, "-=0.5")
          .add(() => {
            isIntroPlayingRef.current = false;
          }); // Reset flag saat selesai normal

        isModalOpenRef.current = true;
      }
      // KONDISI B: Navigasi Next/Prev
      else {
        mainTl
          .to(numberChars, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn, stagger: ANIM_CONFIG.stagger.number, ease: ANIM_CONFIG.ease.out }, 0)
          .to(titleWords, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn + 0.2, stagger: ANIM_CONFIG.stagger.title, ease: ANIM_CONFIG.ease.out }, "-=0.55")
          .to(descWords, { yPercent: 0, opacity: 1, duration: ANIM_CONFIG.duration.textIn, stagger: ANIM_CONFIG.stagger.desc, ease: ANIM_CONFIG.ease.out }, "-=0.8");
      }

      activeTimelineRef.current = mainTl;
      isClosingRef.current = false;

      return () => {
        document.body.style.overflow = "";
        splitRefs.current.number?.revert();
        splitRefs.current.title?.revert();
        splitRefs.current.desc?.revert();
        mainTl.kill();
      };
    },
    { dependencies: [activeIndex] },
  );

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const cleanupAndClose = () => {
      closeFaq();
      setIsFaqsFullyLoaded(false);
      isClosingRef.current = false;
      isModalOpenRef.current = false;
      isIntroPlayingRef.current = false;
      splitRefs.current.faqLabel?.revert();
      splitRefs.current.number?.revert();
      splitRefs.current.title?.revert();
      splitRefs.current.desc?.revert();
    };

    // FIXED: Jika user klik saat intro awal sedang jalan, balikkan timeline langsung (Snappy Back)
    if (isIntroPlayingRef.current && activeTimelineRef.current?.isActive()) {
      activeTimelineRef.current.timeScale(2).reverse(); // Dipercepat 2x agar responsif
      activeTimelineRef.current.eventCallback("onReverseComplete", cleanupAndClose);
      return;
    }

    // Jalankan animasi exit normal jika modal sudah terbuka penuh
    activeTimelineRef.current?.kill();
    const faqChars = splitRefs.current.faqLabel?.chars || [];
    const closeTl = playContentExitAnimation();

    closeTl.to(faqChars, { yPercent: 120, opacity: 0, duration: ANIM_CONFIG.duration.textOut, stagger: -ANIM_CONFIG.stagger.label, ease: ANIM_CONFIG.ease.in }, "-=0.5");

    closeTl
      .to(buttonsRef.current, { y: 100, duration: ANIM_CONFIG.duration.buttonOut, ease: ANIM_CONFIG.ease.in }, "-=0.5")
      .to(modalRef.current, { x: "-100%", duration: ANIM_CONFIG.duration.modalOut, ease: ANIM_CONFIG.ease.in }, "-=0.4")
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: ANIM_CONFIG.duration.overlayOut,
          ease: ANIM_CONFIG.ease.overlayOut,
          onComplete: cleanupAndClose,
        },
        "-=0.025",
      );
  };

  const handleNavigation = (direction) => {
    if (activeIndex === null || isClosingRef.current) return;
    isClosingRef.current = true;

    activeTimelineRef.current?.kill();

    const targetIndex = direction === "next" ? (activeIndex >= faqs.length - 1 ? 0 : activeIndex + 1) : activeIndex <= 0 ? faqs.length - 1 : activeIndex - 1;

    playContentExitAnimation(() => {
      openFaq(targetIndex);
    });
  };

  if (loading || activeIndex === null || !faq) return null;

  return (
    <section className="fixed inset-0 z-[999] overflow-hidden">
      {/* Background Overlay */}
      <div ref={overlayRef} onClick={handleClose} className="absolute inset-0 z-10 bg-warna2/40 cursor-pointer" />

      {/* Sliding Sheet Container */}
      <div className="absolute top-0 left-0 z-20 h-full w-fit">
        <aside ref={modalRef} className="flex h-dvh w-screen lg:w-[28dvw] flex-col justify-between bg-warna1 p-6 select-none">
          {/* Top Section */}
          <div>
            <h1 ref={faqLabelRef} className="text-sm font-bold text-warna2 overflow-hidden">
              FAQ
            </h1>
          </div>

          {/* Middle Section */}
          <div className="flex h-full items-center">
            <div key={activeIndex} className="flex flex-col gap-10 w-full">
              <h2 ref={numberRef} className="text-lg font-bold text-warna2 overflow-hidden">
                {(activeIndex + 1).toString().padStart(2, "0")}
              </h2>

              <div className="w-full h-[44dvh] flex flex-col justify-center gap-10">
                <h2 ref={titleRef} className="text-xl font-bold leading-[1.1] overflow-hidden">
                  {faq.descB}
                </h2>
                <p ref={descRef} className="text-sm leading-relaxed overflow-hidden">
                  {faq.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div ref={buttonsRef} className="flex justify-between items-center">
            <button onClick={handleClose} className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-md bg-warna2 transition-transform active:scale-95" aria-label="Close details">
              <X className="h-5 w-5 text-warna1" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleNavigation("prev")}
                className="cursor-pointer flex h-10 w-14 items-center justify-center rounded-md border border-black/10 bg-white/60 transition-transform active:scale-95"
                aria-label="Previous item"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => handleNavigation("next")} className="cursor-pointer flex h-10 w-14 items-center justify-center rounded-md border border-black/10 bg-white/60 transition-transform active:scale-95" aria-label="Next item">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default FaqDetails;
