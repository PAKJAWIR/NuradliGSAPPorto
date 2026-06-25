import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { useProjects } from "../context/ProjectContext";
import { useDevice } from "../context/DeviceProvider";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import gsap from "gsap";

function ProjectsDetail() {
  const { activeIndex, projects, activeProject, closeProject, setIsProjectFullyLoaded } = useProjects();

  const { isMobile, isTablet } = useDevice();

  // =========================
  // ELEMENT REFS
  // =========================

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // separate image overlay refs
  const tabletImgOverlayRef = useRef(null);
  const desktopImgOverlayRef = useRef(null);

  const scrollRef = useRef(null);
  const buttonsRef = useRef(null);

  // =========================
  // ANIMATION STATE
  // =========================

  const tlRef = useRef(null);

  const isClosing = useRef(false);

  const lastScroll = useRef(0);

  // =========================
  // ACTIVE PROJECT
  // =========================

  const project = activeIndex !== null && projects?.length ? projects[activeIndex] : null;

  // floating controls only for mobile + tablet
  const useFloatingControls = isMobile;

  // image reveal only for tablet + desktop
  const useImageReveal = !isMobile;

  // active overlay ref based on device
  const activeImgOverlayRef = isTablet ? tabletImgOverlayRef : desktopImgOverlayRef;

  // =========================
  // OPEN + SCROLL ANIMATION
  // =========================

  useGSAP(
    () => {
      if (!activeProject) {
        document.body.style.overflow = "";

        return;
      }

      const container = scrollRef.current;

      isClosing.current = false;

      document.body.style.overflow = "hidden";

      // =========================
      // INITIAL STATES
      // =========================

      gsap.set(overlayRef.current, {
        opacity: 0,
      });

      gsap.set(modalRef.current, {
        y: "100%",
      });

      // image reveal only tablet + desktop
      if (useImageReveal && activeImgOverlayRef.current) {
        gsap.set(activeImgOverlayRef.current, {
          scaleY: 1,
          transformOrigin: "top",
        });
      }

      // floating controls initial state
      gsap.set(buttonsRef.current, {
        y: useFloatingControls ? 120 : 0,
        opacity: useFloatingControls ? 0 : 1,
        pointerEvents: useFloatingControls ? "none" : "auto",
      });

      lastScroll.current = 0;

      // =========================
      // OPEN TIMELINE
      // =========================

      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        // smoother pause after modal fully visible
        onComplete: () => {
          setIsProjectFullyLoaded(true);
        },
      }).to(
        modalRef.current,
        {
          y: "0%",
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.2",
      );

      // image reveal only tablet + desktop
      if (useImageReveal && activeImgOverlayRef.current) {
        tl.to(
          activeImgOverlayRef.current,
          {
            scaleY: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          ">-=0.7",
        );
      }

      tlRef.current = tl;

      // =========================
      // DESKTOP
      // =========================

      if (!useFloatingControls) {
        return () => {
          document.body.style.overflow = "";

          tl.kill();
        };
      }

      // =========================
      // BUTTON HELPERS
      // =========================

      const showButtons = () => {
        gsap.to(buttonsRef.current, {
          y: 0,
          opacity: 1,
          pointerEvents: "auto",
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const hideButtons = () => {
        gsap.to(buttonsRef.current, {
          y: 120,
          opacity: 0,
          pointerEvents: "none",
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });
      };

      // =========================
      // SCROLL BEHAVIOR
      // =========================

      const handleScroll = () => {
        const currentScroll = container.scrollTop;

        const diff = currentScroll - lastScroll.current;

        // near top
        if (currentScroll <= 10) {
          hideButtons();

          lastScroll.current = currentScroll;

          return;
        }

        // scroll down
        if (diff > 2) {
          showButtons();
        }

        // scroll up
        else if (diff < -2) {
          hideButtons();
        }

        lastScroll.current = currentScroll;
      };

      container.addEventListener("scroll", handleScroll);

      // =========================
      // CLEANUP
      // =========================

      return () => {
        document.body.style.overflow = "";

        tl.kill();

        container.removeEventListener("scroll", handleScroll);
      };
    },
    {
      dependencies: [activeProject, isMobile, isTablet],
    },
  );
  // =========================
  // CLOSE MODAL
  // =========================

  const handleClose = () => {
    if (isClosing.current) return;

    isClosing.current = true;

    tlRef.current?.kill();

    const closeTl = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        closeProject();
        setIsProjectFullyLoaded(false);
        isClosing.current = false;
      },
    });

    // mobile only controls exit
    if (isMobile) {
      closeTl.to(
        buttonsRef.current,
        {
          y: 120,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        0,
      );
    }

    closeTl.to(
      modalRef.current,
      {
        y: "100%",
        duration: 1.2,
        ease: "power3.in",
      },
      "<-=0.3",
    );

    // image close reveal only tablet + desktop
    if (useImageReveal && activeImgOverlayRef.current) {
      closeTl.to(
        activeImgOverlayRef.current,
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power3.in",
          transformOrigin: "top",
        },
        "<+=0.2",
      );
    }

    closeTl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.in",
      },
      ">-=0.5",
    );
  };

  // =========================
  // EARLY RETURN
  // =========================

  if (activeIndex === null || !project) return null;

  return (
    <section className="fixed inset-0 z-50">
      {/* Overlay */}
      <div ref={overlayRef} onClick={handleClose} className="absolute inset-0 z-10 bg-warna2/40" />

      {/* Modal */}
      <div ref={modalRef} className="absolute bottom-0 z-20 w-full bg-warna1 translate-y-full">
        {/* Scroll Container */}
        <div ref={scrollRef} className="h-[96dvh] overflow-y-auto w-screen">
          <div className="flex flex-col min-h-full w-full">
            {/* ========================= */}
            {/* MOBILE */}
            {/* ========================= */}

            <div className="flex md:hidden flex-col w-full gap-[3.4dvh]">
              {/* Image */}
              <div className="relative w-full overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-[83dvh] object-cover object-center" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-[6dvh] p-3 mb-[10dvh]">
                {/* Title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold uppercase leading-none">{project.title}</h2>

                    <h3 className="text-[10px] uppercase font-bold opacity-60">{project.projects} Project</h3>
                  </div>

                  <h3 className="text-[10px] font-bold pt-1">{project.date}</h3>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed opacity-80">{project.description}</p>
              </div>
            </div>

            {/* ========================= */}
            {/* TABLET */}
            {/* ========================= */}

            <div className="hidden md:flex lg:hidden items-center min-h-[96dvh] w-full p-6">
              <div className="grid grid-cols-2 items-center gap-10 w-full">
                {/* Image */}
                <div className="flex justify-start items-center">
                  <div className="relative overflow-hidden rounded-md">
                    <div ref={tabletImgOverlayRef} className="absolute inset-0 z-30 bg-warna1 scale-y-100" />

                    <img src={project.image} alt={project.title} className="h-[58dvh] w-[44vw] rounded-md object-cover object-center" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex w-full h-full items-center justify-start">
                  <div className="flex flex-col gap-10 max-w-full h-full justify-around">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold uppercase leading-none">{project.title}</h2>

                        <h3 className="text-xs uppercase font-bold">{project.projects} Project</h3>
                      </div>

                      <h3 className="text-[10px] font-bold pt-1">{project.date}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed opacity-80">{project.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================= */}
            {/* DESKTOP */}
            {/* ========================= */}

            <div className="hidden lg:flex items-center flex-row gap-4 flex-1 w-full p-6">
              {/* Title */}
              <div className="flex items-end justify-start h-full w-full">
                <div className="flex flex-col justify-between h-full w-full">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold uppercase">{project.title}</h2>

                    <h3 className="text-xs uppercase font-bold">{project.projects} Project</h3>
                  </div>

                  <h3 className="text-xs font-bold mb-2">{project.date}</h3>
                </div>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center h-full w-full">
                <div className="relative overflow-hidden rounded-md">
                  <div ref={desktopImgOverlayRef} className="absolute inset-0 z-30 bg-warna1 scale-y-100" />

                  <img src={project.image} alt={project.title} className="h-[80dvh] w-[24vw] rounded-md object-cover object-center" />
                </div>
              </div>

              {/* Description */}
              <div className="flex items-center justify-end h-full w-full">
                <p className="text-sm w-[70%] leading-relaxed">{project.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div ref={buttonsRef} className="fixed bottom-0 left-0 z-50 w-full p-3 md:p-6 pointer-events-none">
          <div className="flex justify-between lg:justify-end gap-2 pointer-events-auto">
            {/* Navigation */}
            <div className="flex gap-2">
              <button className="cursor-pointer flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-md border border-black/10 bg-white/60 backdrop-blur-xl">
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>

              <button className="cursor-pointer flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-md border border-black/10 bg-white/60 backdrop-blur-xl">
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Close */}
            <button onClick={handleClose} className="cursor-pointer flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-md bg-warna2">
              <X className="w-6 h-6 text-warna1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsDetail;
