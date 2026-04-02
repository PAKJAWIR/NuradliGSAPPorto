import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect, useState } from "react";
import { useProjects } from "../context/ProjectContext";
import SpanHoverAnimations from "../component/atoms/SpanHoverAnimations";
import HoverArrow from "./HoverArrow";
import LinkText from "../component/atoms/LinkText";
import { Draggable } from "gsap/all";
import { useDevice } from "../context/DeviceProvider";

gsap.registerPlugin(Draggable);

function ProjectsDetail() {
  const { activeIndex, projects, activeProject, closeProject, setIsProjectFullyLoaded } = useProjects();
  const [viewIndex, setViewIndex] = useState(activeIndex);

  useEffect(() => {
    setViewIndex(activeIndex);
  }, [activeIndex]);

  const overlayRef = useRef(null);
  const overlayImgRef = useRef(null);
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const linkPrev = useRef(null);
  const linkNext = useRef(null);
  const collectRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const projectRef = useRef(null);
  const isClosingRef = useRef(false);
  const tlRef = useRef(null);
  const dragHandleRef = useRef(null); // <-- REF BARU UNTUK AREA DRAG

  const { isMobile } = useDevice();
  const [isAnimating, setIsAnimating] = useState(false);
  const visibleProjects = projects.slice(0, 4);
  const total = visibleProjects.length;

  const project = visibleProjects && viewIndex !== null ? visibleProjects[viewIndex] : null;

  const handleDragClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    gsap.to(containerRef.current, {
      y: window.innerHeight,
      duration: 0.5,
      ease: "power1.in",
      onComplete: () => {
        setIsProjectFullyLoaded(false);
        isClosingRef.current = false;
        closeProject();
      },
    });
  };

  /* ──────────────────────────────────────────────
   * MASTER ANIMATION & DRAGGABLE INIT
   * ────────────────────────────────────────────── */
  useGSAP(
    () => {
      if (!activeProject || !project) return;

      // 1. SETUP DRAGGABLE (HANYA DI MOBILE & HANYA DI HEADER)
      if (isMobile && dragHandleRef.current && containerRef.current) {
        Draggable.create(containerRef.current, {
          type: "y",
          trigger: dragHandleRef.current, // <-- KUNCI: Cuma bisa ditarik lewat area ini
          bounds: { minY: 0, maxY: window.innerHeight },
          inertia: true,
          onDragEnd() {
            if (this.y > 150) {
              handleDragClose();
            } else {
              gsap.to(containerRef.current, { y: 0, duration: 0.3, ease: "power3.out" });
            }
          },
        });
      }

      // 2. SETUP INTRO ANIMATION (ONCE)
      if (!tlRef.current) {
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        gsap.set(containerRef.current, { yPercent: 100 });
        gsap.set(btnRef.current, { yPercent: 100 });
        gsap.set(overlayImgRef.current, { scaleY: 1, transformOrigin: "top", autoAlpha: 1 });

        const introTl = gsap.timeline();
        introTl
          .to(overlayRef.current, { autoAlpha: 1, duration: 1.1, ease: "power3.out" })
          .to(containerRef.current, { yPercent: 0, duration: 1.1, ease: "power3.out" }, "<")
          .to(btnRef.current, { yPercent: 0, duration: 0.8 }, ">-=0.5")
          .to(overlayImgRef.current, { scaleY: 0, duration: 1.1, ease: "power3.out" }, "<")
          .call(
            () => {
              [categoryRef, titleRef, projectRef, descriptionRef, collectRef].forEach((r) => r.current?.animate?.());
              linkPrev.current?.show();
              linkNext.current?.show();
              setIsProjectFullyLoaded(true);
            },
            null,
            "<-=0.3",
          );

        tlRef.current = introTl;
      }
    },
    { dependencies: [viewIndex, isMobile] },
  ); // Tambah isMobile ke dependency

  // ... (Fungsi navigate, handleNext, handlePrev, handleClose TETAP SAMA seperti kodemu) ...
  const navigate = (nextIdx) => {
    if (nextIdx === viewIndex) return;
    if (isAnimating) return;
    setIsAnimating(true);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => setIsAnimating(false) });
    tl.set(overlayImgRef.current, { transformOrigin: "top" })
      .to(overlayImgRef.current, { scaleY: 1, duration: 1, ease: "power3.in" })
      .call(
        () => {
          [categoryRef, titleRef, projectRef, dateRef, descriptionRef].forEach((r) => r.current?.animate2?.());
        },
        null,
        "<+=0.1",
      )
      .call(
        () => {
          setViewIndex(nextIdx);
        },
        null,
        ">+=1.1",
      )
      .set(overlayImgRef.current, { transformOrigin: "top" })
      .to(overlayImgRef.current, { scaleY: 0, duration: 1.1, ease: "power3.out", delay: 0.5 }, ">")
      .call(
        () => {
          [categoryRef, titleRef, projectRef, descriptionRef].forEach((r) => r.current?.animate?.());
        },
        null,
        "<+=0.7",
      );
  };

  const handleNext = () => {
    if (total) navigate((viewIndex + 1) % total);
  };
  const handlePrev = () => {
    if (total) navigate((viewIndex - 1 + total) % total);
  };

  const handleClose = () => {
    if (!tlRef.current || isClosingRef.current) return;
    isClosingRef.current = true;
    [linkPrev, linkNext, collectRef, descriptionRef, categoryRef, titleRef, projectRef].forEach((ref) => ref.current?.animate2?.() || ref.current?.hide?.());
    tlRef.current
      .timeScale(1)
      .reverse()
      .eventCallback("onReverseComplete", () => {
        setIsProjectFullyLoaded(false);
        isClosingRef.current = false;
        tlRef.current = null;
        closeProject();
      });
  };

  useEffect(() => {
    if (activeProject) {
      // Kunci scroll di Desktop & Mobile
      document.body.style.overflow = "hidden";

      // Khusus Mobile: Cegah "bounce" atau tarikan background
      document.body.style.touchAction = "none";

      // Tapi kita ingin konten di dalam modal TETAP bisa di-scroll
      // Jadi kita harus kembalikan touchAction di container modalnya
      if (containerRef.current) {
        containerRef.current.style.touchAction = "pan-y";
      }
    }

    return () => {
      // Cleanup saat modal ditutup
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [activeProject]);

  if (activeIndex === null || viewIndex === null || !project) return null;

  return (
    <div className="fixed inset-0 z-999">
      {/* Overlay Close */}
      <div ref={overlayRef} onClick={handleClose} className="fixed inset-0 bg-warna2/25 mix-blend-difference" />

      {/* CONTAINER UTAMA MODAL */}
      <div ref={containerRef} className=" fixed bottom-0 h-[90vh] w-screen bg-warna1 rounded-t-2xl md:rounded-t-none">
        <div ref={dragHandleRef} className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 md:hidden flex justify-center items-start pt-3 z-50 touch-none">
          <div className="w-12 h-1.5 bg-warna2/50 rounded-full" />
        </div>
        {/* Tombol Close Desktop */}
        <div className="absolute bottom-0 p-8 w-screen justify-end z-555 overflow-hidden md:flex hidden">
          <div ref={btnRef}>
            <SpanHoverAnimations isClicked onClick={handleClose} className="bg-warna2 rounded-sm p-2" spanColor="bg-warna1" spanWidth="w-3 md:w-6" />
          </div>
        </div>
        {/* FIXED NAVBAR HEADER */}
        <div className="absolute top-0 left-0 h-16 w-full flex justify-between items-center px-5 z-40 bg-warna1 rounded-t-2xl md:rounded-t-none">
          <div onClick={handlePrev} className="h-fit w-fit z-50 cursor-pointer p-2 -ml-2">
            <HoverArrow ref={linkPrev} duration={1.1} direction="left" as="h3" text=" Prev" className="text-warna2 overflow-hidden font-bold text-[10px] md:text-xs uppercase" />
          </div>

          <div className="mt-2">
            <LinkText ref={collectRef} as="h3" duration={1.1} className="text-warna2 text-[10px] md:text-xs font-bold uppercase z-50" text="All Collected" />
          </div>

          <div onClick={handleNext} className="h-fit w-fit z-50 cursor-pointer p-2 -mr-2">
            <HoverArrow ref={linkNext} duration={1.1} direction="right" as="h3" text="NEXT" className="text-warna2 overflow-hidden font-bold text-[10px] md:text-xs uppercase" />
          </div>
        </div>

        {/* SCROLLABLE CONTENT (Sudah aman karena nggak dibajak Draggable) */}
        <div className="h-full overflow-y-auto px-3 md:px-15 pt-20 pb-10 no-scrollbar stop-chaining relative z-10">
          <div className="flex  flex-col-reverse md:flex-row gap-10 min-h-screen pb-1 md:pb-20">
            <div className="w-full md:w-1/2 flex items-end ">
              <div className="relative w-full md:w-100 h-120 md:h-160 rounded-xl overflow-hidden">
                <div ref={overlayImgRef} className="absolute inset-0 bg-warna1 z-20" />
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div key={viewIndex} className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-end gap-1">
                <LinkText as="span" ref={categoryRef} duration={1.1} className="text-[10px] md:text-[11px] uppercase font-semibold mb-2" text={project.category} />
                <LinkText as="h1" ref={titleRef} duration={1.1} className="text-2xl md:text-3xl uppercase font-bold mb-2" text={project.title} />
                <LinkText as="span" ref={projectRef} duration={1.1} className="text-[10px] md:text-[11px] uppercase font-semibold" text={`${project.projects} PROJECTS`} />
              </div>
              <div className="flex-1 flex items-end mt-10 overflow-hidden">
                <LinkText ref={descriptionRef} as="p" offsetY={400} duration={0.8} className="text-xs md:text-sm w-80 md:w-100" text={project.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsDetail;
