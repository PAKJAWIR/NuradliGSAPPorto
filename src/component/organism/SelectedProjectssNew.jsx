import { useRef, useEffect } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useDevice } from "../../context/DeviceProvider";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TextHeadingAnimation from "../../animations/TextHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

// ==========================================================
// CONSTANTS & CONFIGURATIONS
// ==========================================================
const CLIP_PATHS = {
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  full: "inset(0% 0% 0% 0%)",
  midClip: "inset(50% 0% 50% 0%)", // Menutup ke tengah ala desktop
};

const ANIM_CONFIG = {
  easeOut: "power3.out",
  easeExpo: "expo.out",
  easeModal: "power2.out",

  // Durations
  durOverlayEnter: 0.45,
  durOverlayLeave: 0.35,
  durScrollEnter: 0.6,
  durScrollLeave: 0.8,
  durImageStack: 0.6,
  durHighlightMove: 0.8, // Durasi geser antar baris
  durHighlightLeave: 0.6, // Durasi menutup/membuka clipPath
  durModalToggle: 0.3,
  durModalRestore: 0.5,
};

function SelectedProjectssNew() {
  const { projects, openProject, activeProject } = useProjects();
  const { isMobile, isTablet } = useDevice();

  const displayedProjects = projects.slice(0, 4);

  // Flags
  const enableHover = !isMobile && !isTablet;
  const enableScrollTrigger = isMobile || isTablet;

  // DOM Refs
  const highlightRef = useRef(null);
  const mobileHighlightRef = useRef(null);
  const itemsRef = useRef([]);
  const imageRefs = useRef([]);
  const overlayRefs = useRef([]);
  const mobileImageRefs = useRef([]);

  // Animation Trackers
  const lastIndex = useRef(-1);
  const activeTriggerIndex = useRef(-1);
  const isProjectOpen = useRef(false);
  const isMobileHighlightVisible = useRef(false); // Tracker status buka/tutup highlight mobile

  const { contextSafe } = useGSAP();

  // Kalkulasi koordinat hover preview desktop
  const getHighlightCoords = (item) => {
    const OFFSET = 60;
    return {
      targetY: item.offsetTop - OFFSET,
      targetHeight: item.offsetHeight + OFFSET * 2,
    };
  };

  // ==========================================================
  // MOBILE + TABLET: SCROLLTRIGGER ANIMATION
  // ==========================================================
  useGSAP(
    () => {
      if (displayedProjects.length === 0) return;

      // Reset state row overlay berdasarkan capability device
      gsap.set(overlayRefs.current, {
        scaleY: enableScrollTrigger ? 1 : 0,
        clipPath: enableScrollTrigger ? CLIP_PATHS.top : "none",
        autoAlpha: 1,
      });

      if (!enableScrollTrigger) return;

      // Set posisi awal dan tutup stack mobile menggunakan clipPath murni
      const firstItem = itemsRef.current[0];
      if (firstItem && mobileHighlightRef.current) {
        gsap.set(mobileHighlightRef.current, {
          y: firstItem.offsetTop + (firstItem.offsetHeight - 72) / 2,
          clipPath: CLIP_PATHS.midClip,
        });
        isMobileHighlightVisible.current = false;
      }

      const triggers = [];

      overlayRefs.current.forEach((overlay, index) => {
        const item = itemsRef.current[index];
        if (!overlay || !item) return;

        const isFirstItem = index === 0;
        const isLastItem = index === displayedProjects.length - 1;

        const trigger = ScrollTrigger.create({
          trigger: item,
          start: "top center-=10%",
          end: "bottom center-=10%",

          onEnter: () => {
            activeTriggerIndex.current = index;
            if (isProjectOpen.current) return;

            gsap.fromTo(overlay, { clipPath: CLIP_PATHS.top }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durScrollEnter, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });

            if (mobileHighlightRef.current) {
              const targetY = item.offsetTop + (item.offsetHeight - 72) / 2;

              // Jika sebelumnya tertutup, buka dengan clipPath murni (tanpa opacity)
              if (!isMobileHighlightVisible.current) {
                isMobileHighlightVisible.current = true;
                gsap.killTweensOf(mobileHighlightRef.current);
                gsap.set(mobileHighlightRef.current, { y: targetY });
                gsap.fromTo(mobileHighlightRef.current, { clipPath: CLIP_PATHS.midClip }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durHighlightLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });
              } else {
                // Jika sudah terbuka, geser smooth antar baris
                gsap.to(mobileHighlightRef.current, { y: targetY, clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durHighlightMove, ease: ANIM_CONFIG.easeExpo, overwrite: "auto" });
              }
            }

            animateMobileImageStack(index);
          },

          onLeave: () => {
            if (isProjectOpen.current) return;
            gsap.to(overlay, { clipPath: CLIP_PATHS.bottom, duration: ANIM_CONFIG.durScrollLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });

            // Tutup dengan clipPath ke tengah jika melewati batas bawah list
            if (mobileHighlightRef.current && isLastItem) {
              isMobileHighlightVisible.current = false;
              gsap.to(mobileHighlightRef.current, { clipPath: CLIP_PATHS.midClip, duration: ANIM_CONFIG.durHighlightLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });
            }
          },

          onEnterBack: () => {
            activeTriggerIndex.current = index;
            if (isProjectOpen.current) return;

            gsap.fromTo(overlay, { clipPath: CLIP_PATHS.bottom }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durScrollLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });

            if (mobileHighlightRef.current) {
              const targetY = item.offsetTop + (item.offsetHeight - 72) / 2;

              // Buka kembali dengan clipPath jika scroll balik dari bawah
              if (!isMobileHighlightVisible.current) {
                isMobileHighlightVisible.current = true;
                gsap.killTweensOf(mobileHighlightRef.current);
                gsap.set(mobileHighlightRef.current, { y: targetY });
                gsap.fromTo(mobileHighlightRef.current, { clipPath: CLIP_PATHS.midClip }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durHighlightLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });
              } else {
                // Tetap geser smooth antar baris sewaktu scroll up
                gsap.to(mobileHighlightRef.current, { y: targetY, clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durHighlightMove, ease: ANIM_CONFIG.easeExpo, overwrite: "auto" });
              }
            }

            animateMobileImageStack(index);
          },

          onLeaveBack: () => {
            if (isProjectOpen.current) return;
            gsap.to(overlay, { clipPath: CLIP_PATHS.top, duration: ANIM_CONFIG.durScrollEnter, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });

            // Tutup dengan clipPath ke tengah jika melewati batas atas list
            if (mobileHighlightRef.current && isFirstItem) {
              isMobileHighlightVisible.current = false;
              gsap.to(mobileHighlightRef.current, { clipPath: CLIP_PATHS.midClip, duration: ANIM_CONFIG.durHighlightLeave, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });
            }
          },
        });

        triggers.push(trigger);
      });

      ScrollTrigger.refresh();
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { dependencies: [enableScrollTrigger, displayedProjects] },
  );

  // ==========================================================
  // MOBILE + TABLET: RESTORE AFTER MODAL CLOSE
  // ==========================================================
  useEffect(() => {
    if (!enableScrollTrigger) return;

    if (activeProject !== null && activeProject !== undefined) {
      isProjectOpen.current = true;
      return;
    }

    isProjectOpen.current = false;
    const index = activeTriggerIndex.current;
    if (index === -1) return;

    const overlay = overlayRefs.current[index];
    if (!overlay) return;

    gsap.to(overlay, {
      autoAlpha: 1,
      clipPath: CLIP_PATHS.full,
      duration: ANIM_CONFIG.durModalRestore,
      ease: ANIM_CONFIG.easeOut,
      overwrite: "auto",
    });
  }, [activeProject, enableScrollTrigger]);

  // ==========================================================
  // DESKTOP: UNIFIED DIRECTIONAL HOVER HANDLER
  // ==========================================================
  const handleDirectionalHover = contextSafe((index, e) => {
    if (!enableHover) return;

    const overlay = overlayRefs.current[index];
    const item = itemsRef.current[index];
    if (!overlay || !item) return;

    const rect = item.getBoundingClientRect();
    const isFromTop = e.clientY < rect.top + rect.height / 2;
    const targetClipPath = isFromTop ? CLIP_PATHS.top : CLIP_PATHS.bottom;

    if (e.type === "mouseenter" || e.type === "mousemove") {
      gsap.set(overlay, { scaleY: 1 });
      gsap.fromTo(overlay, { clipPath: targetClipPath }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durOverlayEnter, ease: ANIM_CONFIG.easeOut, overwrite: "auto" });
    } else if (e.type === "mouseleave") {
      gsap.to(overlay, {
        clipPath: targetClipPath,
        duration: ANIM_CONFIG.durOverlayLeave,
        ease: ANIM_CONFIG.easeOut,
        overwrite: "auto",
      });
    }
  });

  // ==========================================================
  // DESKTOP: IMAGE STACK ANIMATION
  // ==========================================================
  const animateImageStack = contextSafe((index) => {
    if (!enableHover || lastIndex.current === index) return;

    const isFirst = lastIndex.current === -1;
    const totalItems = displayedProjects.length;

    imageRefs.current.forEach((img, i) => {
      if (!img) return;

      gsap.killTweensOf(img);
      gsap.set(img, { zIndex: totalItems - i });

      const targetYPercent = i < index ? -100 : 0;

      if (isFirst) {
        gsap.set(img, { yPercent: targetYPercent });
      } else {
        gsap.to(img, {
          yPercent: targetYPercent,
          duration: ANIM_CONFIG.durImageStack,
          ease: ANIM_CONFIG.easeOut,
          overwrite: "auto",
        });
      }
    });

    lastIndex.current = index;
  });

  // ==========================================================
  // MOBILE: IMAGE STACK ANIMATION (1:1 Copy Desktop Logic)
  // ==========================================================
  const animateMobileImageStack = contextSafe((index) => {
    if (!enableScrollTrigger || lastIndex.current === index) return;

    const isFirst = lastIndex.current === -1;
    const totalItems = displayedProjects.length;

    mobileImageRefs.current.forEach((img, i) => {
      if (!img) return;

      gsap.killTweensOf(img);
      gsap.set(img, { zIndex: totalItems - i });

      const targetYPercent = i < index ? -100 : 0;

      if (isFirst) {
        gsap.set(img, { yPercent: targetYPercent });
      } else {
        gsap.to(img, {
          yPercent: targetYPercent,
          duration: ANIM_CONFIG.durImageStack,
          ease: ANIM_CONFIG.easeOut,
          overwrite: "auto",
        });
      }
    });

    lastIndex.current = index;
  });

  // ==========================================================
  // DESKTOP: CONTAINER HIGHLIGHT HANDLERS
  // ==========================================================
  const handleEnter = contextSafe((index) => {
    if (!enableHover) return;

    const highlight = highlightRef.current;
    const item = itemsRef.current[index];
    if (!highlight || !item) return;

    const { targetY, targetHeight } = getHighlightCoords(item);

    gsap.killTweensOf(highlight);
    gsap.set(highlight, { y: targetY, height: targetHeight, opacity: 1 });

    gsap.fromTo(highlight, { clipPath: CLIP_PATHS.midClip }, { clipPath: CLIP_PATHS.full, duration: ANIM_CONFIG.durHighlightLeave, ease: ANIM_CONFIG.easeOut });

    animateImageStack(index);
  });

  const handleHover = contextSafe((index) => {
    if (!enableHover || lastIndex.current === index) return;

    const highlight = highlightRef.current;
    const item = itemsRef.current[index];
    if (!highlight || !item) return;

    const { targetY, targetHeight } = getHighlightCoords(item);

    gsap.killTweensOf(highlight);
    gsap.to(highlight, {
      y: targetY,
      height: targetHeight,
      opacity: 1,
      clipPath: CLIP_PATHS.full,
      duration: ANIM_CONFIG.durHighlightMove,
      ease: ANIM_CONFIG.easeExpo,
      overwrite: "auto",
    });

    animateImageStack(index);
  });

  const handleLeave = contextSafe(() => {
    if (!enableHover) return;

    const highlight = highlightRef.current;
    if (!highlight) return;

    gsap.killTweensOf(highlight);
    gsap.to(highlight, {
      clipPath: CLIP_PATHS.midClip,
      duration: ANIM_CONFIG.durHighlightLeave,
      ease: ANIM_CONFIG.easeOut,
      overwrite: "auto",
    });

    lastIndex.current = -1;
  });

  // ==========================================================
  // CLICK HANDLER
  // ==========================================================
  const handleItemClick = contextSafe((index) => {
    openProject(index);

    if (enableScrollTrigger) {
      isProjectOpen.current = true;
      const overlay = overlayRefs.current[index];

      if (overlay) {
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: ANIM_CONFIG.durModalToggle,
          ease: ANIM_CONFIG.easeModal,
          overwrite: "auto",
        });
      }
    }
  });

  return (
    <section className="flex items-center justify-center h-fit lg:min-h-screen w-screen bg-warna1 p-4 md:p-6">
      <div className="flex flex-col gap-24 md:gap-12 lg:gap-26 h-fit w-full">
        {/* Heading */}
        <div className="flex flex-col-reverse md:flex-row items-start md:items-end justify-between gap-10 h-fit md:h-[18vh] lg:h-[30vh] w-full">
          <TextHeadingAnimation
            text="This selection presents a range of digital works shaped through careful observation and deliberate craft. Each piece reflects a process of translating abstract ideas into tangible experiences."
            startDesktop="top center+=18%"
            endDesktop="center top+=20%"
            scrubDesktop={1.1}
            disableAnimation={isMobile}
            className="text-xl md:text-2xl lg:text-3xl font-bold w-[92%] md:w-[70%] lg:w-[48%] will-change-opacity inline-block"
            containerClassName="!h-fit !justify-start !items-start w-fit"
          />

          <h2 className="uppercase flex font-bold text-sm w-24 md:justify-end ">My works</h2>
        </div>

        {/* Projects Wrapper */}
        <div className="flex items-center justify-center h-fit md:h-[66vh] lg:h-fit w-full bg-warna1">
          <div className="relative flex flex-col h-fit w-full" onMouseLeave={handleLeave}>
            {/* Desktop Hover Preview */}
            {enableHover && (
              <div ref={highlightRef} className="absolute right-1/3 z-2 w-[20vw] overflow-hidden rounded-md opacity-0 pointer-events-none" style={{ clipPath: "inset(50% 0% 50% 0%)" }}>
                <div className="relative w-full h-full">
                  {displayedProjects.map((project, i) => (
                    <div key={project.id} ref={(el) => (imageRefs.current[i] = el)} className="absolute top-0 left-0 w-full h-full will-change-transform backface-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover select-none pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile ScrollTrigger Preview (Murni menggunakan clipPath bawaan style) */}
            {enableScrollTrigger && (
              <div ref={mobileHighlightRef} className="absolute left-1/2 -translate-x-1/2 z-20 w-28 h-18 overflow-hidden rounded-md pointer-events-none md:hidden bg-warna1 will-change-transform" style={{ clipPath: "inset(50% 0% 50% 0%)" }}>
                <div className="relative w-full h-full">
                  {displayedProjects.map((project, i) => (
                    <div key={`mobile-img-${project.id}`} ref={(el) => (mobileImageRefs.current[i] = el)} className="absolute top-0 left-0 w-full h-full will-change-transform backface-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover select-none pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List Rows */}
            {displayedProjects.map((project, i) => (
              <button
                key={project.id}
                ref={(el) => (itemsRef.current[i] = el)}
                onClick={() => handleItemClick(i)}
                onMouseMove={(e) => {
                  if (!enableHover) return;
                  if (lastIndex.current !== i) {
                    handleDirectionalHover(i, e);
                    lastIndex.current === -1 ? handleEnter(i) : handleHover(i);
                  }
                }}
                onMouseEnter={(e) => {
                  if (!enableHover) return;
                  handleDirectionalHover(i, e);
                  lastIndex.current === -1 ? handleEnter(i) : handleHover(i);
                }}
                onMouseLeave={(e) => {
                  if (!enableHover) return;
                  handleDirectionalHover(i, e);
                }}
                className="relative z-1 flex items-center md:items-center h-[14dvh] md:h-38 w-full overflow-hidden bg-warna1 p-2 md:p-4 lg:p-6 cursor-pointer"
              >
                {/* Overlay */}
                <div ref={(el) => (overlayRefs.current[i] = el)} className="absolute inset-0 z-0 bg-warna3" />

                {/* Content */}
                <div className="relative z-10 flex flex-row lg:flex-row justify-between lg:justify-between gap-12 w-full">
                  <div className="flex flex-col items-start gap-2">
                    <h2 className="font-bold text-warna2 text-md md:text-xl ">{project.title}</h2>
                    <h3 className="text-[11px] md:text-sm font-bold text-warna2 opacity-64">{project.projects}</h3>
                  </div>
                  <h2 className="font-bold text-warna2 text-md md:text-xl">0{project.id}</h2>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectedProjectssNew;
