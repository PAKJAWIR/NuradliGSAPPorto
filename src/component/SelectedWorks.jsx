import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

function SelectedWorks() {
  // State
  const [activeIndex, setActiveIndex] = useState(0); // Index item yang sedang aktif
  const [isAnimating, setIsAnimating] = useState(false); // Flag apakah sedang animasi
  const [isMobile, setIsMobile] = useState(false); // Flag apakah ukuran layar mobile

  // Refs untuk desktop
  const container = useRef(null); // Container utama
  const liRefs = useRef([]); // Array ref untuk setiap elemen <li>
  const highlightRef = useRef(null); // Elemen highlight (misalnya garis bawah menu)
  const overlayRef = useRef(null); // Overlay transisi konten
  const overlayInitRef = useRef(null); // Overlay awal saat load pertama
  const titleRef = useRef(null); // Elemen judul di dalam overlay
  const descRef = useRef(null); // Elemen deskripsi di dalam overlay
  const selectTitle = useRef(null); // Judul bagian menu/section
  const parContentRef = useRef(null); // Wrapper untuk paragraf konten
  const liRef = useRef(null); // Ref ke satu elemen <li>
  const counterRef = useRef(null);
  const viewRef = useRef(null);

  // Refs untuk mobile
  const mobileOverlayRef = useRef(null); // Overlay khusus tampilan mobile
  const mobileOverlayStartRef = useRef(null); // Overlay start khusus tampilan mobile
  const isMobileOpenRef = useRef(false); // Flag internal buka/tutup menu mobile (tanpa re-render)
  const menuListRef = useRef(null); // Ref ke daftar menu di mobile
  const hamLine1Ref = useRef(null); // Ref Hamburger line 1
  const hamLine2Ref = useRef(null); // Ref Hamburger line 2
  const underlineRefs = useRef([null]); // Untuk referensi underline per index

  // Image Data
  const imageData = [
    {
      id: 1,
      label: "Projects #1",
      title: "Pookiebear Shirt",
      description: "A playful design inspired by the viral Pookie Bear meme. This shirt reflects the kind of bond that feels simple yet deep — the kind of friendship built on trust, laughter, and effortless connection.",
      url: "/img/PookieBear.png",
      urlMobile: "/img/PookiebearMobile.png",
    },
    {
      id: 2,
      label: "Projects #2",
      title: "Dreamchaser Shirt",
      description: "Created during a moment of quiet reflection, this shirt represents the journey of chasing dreams. It captures that hopeful space between where you are and where you want to be.",
      url: "/img/dreamchaser.png",
      urlMobile: "/img/DreamchaserMobile.png",
    },
    {
      id: 3,
      label: "Projects #3",
      title: "Berserk Shirt",
      description: "Inspired by the emotional depth of the Berserk manga, this shirt speaks to inner strength, resilience, and fighting silent battles. It’s a tribute to growth through struggle.",
      url: "/img/BerserkShirt.png",
      urlMobile: "/img/BerserkShirtMobile.png",
    },
  ];

  // Mobile Check Screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Animations
  useGSAP(
    () => {
      const splitTitle = new SplitType(selectTitle.current, {
        types: "lines",
        tagName: "span",
      });

      const splitView = new SplitType(viewRef.current, {
        types: "lines",
        tagName: "span",
      });

      const splitCounter = new SplitType(counterRef.current, {
        types: "lines",
        tagName: "span",
      });

      // Animate title lines
      gsap
        .timeline({
          scrollTrigger: {
            trigger: selectTitle.current,
            start: "top center+=215",
            end: "center center",
          },
        })
        .from(splitTitle.lines, {
          y: "200%",
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.1,
        })

        .from(
          splitCounter.lines,
          {
            y: "300%",
            duration: 1.6,
            ease: "power3.out",
          },
          "<"
        )
        .from(
          splitView.lines,
          {
            y: "300%",
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=1.5"
        );

      // Animate content on scroll
      gsap.fromTo(
        liRef.current,
        { y: "-100%", autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: parContentRef.current,
            start: "center bottom-=100",
            end: "center center",
            scrub: 2,
          },
        }
      );

      // Animate overlay on scroll
      gsap.fromTo(
        overlayInitRef.current,
        { x: "0%" },
        {
          x: "-100%",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: parContentRef.current,
            start: "top bottom-=50",
            end: "center center",
            scrub: 2,
          },
        }
      );

      // Mobile Overlay Start
      gsap.fromTo(
        mobileOverlayStartRef.current,
        { xPercent: 0 },
        {
          xPercent: 100,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: parContentRef.current,
            start: "top center",
            end: "center center",
          },
        }
      );

      return () => splitTitle.revert();
    },
    { scope: container }
  );

  // Handle list item click
  const handleLiClick = (index) => {
    if (index === activeIndex || isAnimating) return;

    setIsAnimating(true);
    const direction = index > activeIndex ? "right" : "left";
    const fromX = direction === "right" ? "-100%" : "100%";
    const toX = direction === "right" ? "100%" : "-100%";

    gsap.set(overlayRef.current, { x: fromX });

    // Hide current content
    gsap.to([titleRef.current, descRef.current], {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });

    // Animate overlay in
    gsap.to(overlayRef.current, {
      x: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveIndex(index);

        // Animate overlay out
        gsap.to(overlayRef.current, {
          x: toX,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(overlayRef.current, { x: fromX });

            // Show new content
            gsap.fromTo(
              [titleRef.current, descRef.current],
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: () => setIsAnimating(false),
              }
            );
          },
        });
      },
    });

    animateHighlight(index);
  };

  // Animate link highlight
  const animateHighlight = (index) => {
    const highlight = highlightRef.current;
    const parentRect = highlight?.parentElement?.getBoundingClientRect();

    liRefs.current.forEach((li, i) => {
      if (!li) return;
      li.classList.toggle("text-warna1", i === index);
      li.classList.toggle("text-warna2", i !== index);
    });

    const target = liRefs.current[index];
    if (target && highlight && parentRect) {
      const targetRect = target.getBoundingClientRect();
      const x = targetRect.left - parentRect.left;
      const width = targetRect.width;

      gsap.to(highlight, {
        x,
        width,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  };

  // Handle hamburger mobile
  const liMobileClick = (nextIndex = null) => {
    const overlay = mobileOverlayRef.current;
    const items = menuListRef.current?.children;
    const line1 = hamLine1Ref.current;
    const line2 = hamLine2Ref.current;
    const prevIcon = underlineRefs.current[activeIndex];
    const nextIcon = underlineRefs.current[nextIndex];

    if (!overlay || !items || !line1 || !line2 || isAnimating) return;
    setIsAnimating(true);

    if (!isMobileOpenRef.current) {
      // === OPEN ===
      const openTL = gsap.timeline({
        onComplete: () => {
          isMobileOpenRef.current = true;
          setIsAnimating(false);
        },
      });

      openTL.to(line1, {
        rotate: 45,
        y: 4,
        duration: 0.3,
        transformOrigin: "center center",
        ease: "power2.out",
      });
      openTL.to(
        line2,
        {
          rotate: -45,
          y: -4,
          duration: 0.3,
          transformOrigin: "center center",
          ease: "power2.out",
        },
        "<"
      );

      gsap.set(overlay, { x: "100%", display: "flex", autoAlpha: 0 });

      openTL.to(
        overlay,
        {
          x: "0%",
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "<"
      );

      openTL.fromTo(
        items,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.3"
      );

      if (nextIndex !== null && nextIcon) {
        gsap.set(underlineRefs.current, {
          scaleX: 0,
          transformOrigin: "left",
        });

        openTL.fromTo(
          nextIcon,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.out",
            transformOrigin: "left",
          },
          "-=0.3"
        );
      }
    } else {
      // === CLOSE ===
      const closeTL = gsap.timeline({
        onComplete: () => {
          isMobileOpenRef.current = false;
          setIsAnimating(false);
          gsap.set(overlay, { display: "none" });
        },
      });

      closeTL.to([line1, line2], {
        rotate: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });

      if (nextIndex !== null && prevIcon && nextIcon) {
        closeTL.to(prevIcon, {
          scaleX: 0,
          duration: 0.5,
          ease: "power3.inOut",
          transformOrigin: "right", // keluar ke kanan
          onComplete: () => setActiveIndex(nextIndex),
        });

        closeTL.fromTo(
          nextIcon,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 0.5,
            ease: "power3.out",
            transformOrigin: "left", // masuk dari kiri
          }
        );
      }

      closeTL.to(items, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
        stagger: { each: 0.07, from: "end" },
      });

      closeTL.to(overlay, {
        x: "100%",
        autoAlpha: 1,
        delay: 0.3,
        duration: 0.5,
        ease: "power3.in",
      });
    }
  };

  // Init mobile overlay
  useEffect(() => {
    gsap.set(mobileOverlayRef.current, {
      x: "100%",
      display: "none",
      autoAlpha: 0,
    });
  }, []);

  // On first load
  useEffect(() => {
    animateHighlight(activeIndex);
    gsap.set(overlayRef.current, { x: "-100%" });

    gsap.fromTo(
      [titleRef.current, descRef.current],
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.1,
        ease: "power2.out",
        delay: 0.1,
      }
    );
  }, []);

  return (
    <div ref={container} className="flex flex-col w-full h-fit lg:py-5 justify-center items-start gap-1">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between w-full mb-3 px-5 md:px-10">
        {/* Title + Counter */}
        <div className="relative flex w-full md:w-auto ">
          <h1 ref={selectTitle} className="text-3xl lg:text-4xl text-warna2 font-medium">
            Selected Works
          </h1>
          {/* Counter di kanan atas teks */}
          <span ref={counterRef} className="text-sm lg:text-xl text-warna2">
            ({imageData.length})
          </span>
        </div>

        {/* View All Works */}
        <div ref={viewRef} className="flex text-sm md:text-md font-normal items-center justify-end w-full md:w-auto md:ml-auto">
          <a href="#" className="flex items-center gap-1 group transition-all duration-200 ease-in-out ">
            View all works
            <FiArrowRight className="transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <div ref={parContentRef} className="flex flex-col w-full h-fit gap-5">
        <div className="relative w-full h-150 md:h-155 overflow-hidden">
          {/* === Mobile: Overlay Start === */}
          <div ref={mobileOverlayStartRef} className="lg:hidden flex absolute w-full h-full bg-warna1 z-40"></div>
          {/* === Mobile: Hamburger Button === */}
          <div className="absolute top-3 right-3 z-31 lg:hidden">
            <div className="bg-warna1/60 rounded-sm w-15 h-10 flex flex-col justify-center items-center gap-1.5 cursor-pointer" onClick={liMobileClick}>
              <span ref={hamLine1Ref} className="block w-6  h-[1.5px] bg-warna2 rounded-sm"></span>
              <span ref={hamLine2Ref} className=" block w-6  h-[1.5px] bg-warna2 rounded-sm"></span>
            </div>
          </div>
          {/* === Mobile: Overlay Menu === */}
          <div ref={mobileOverlayRef} className="lg:hidden flex absolute w-full h-full bg-warna1 z-30 flex-col items-center justify-center gap-10">
            <ul ref={menuListRef} className="flex flex-col items-center justify-center gap-5">
              {imageData.map((item, index) => (
                <li
                  key={item.id}
                  className="relative text-warna2 text-xs cursor-pointer overflow-hidden group"
                  onClick={() => {
                    if (!isAnimating && index !== activeIndex) {
                      handleLiClick(index);
                      liMobileClick(index);
                    }
                  }}
                >
                  <span className="block px-3 py-1 relative z-10">{item.label}</span>
                  <span ref={(el) => (underlineRefs.current[index] = el)} className="absolute bottom-0 left-0 h-[1px] bg-warna2" style={{ width: activeIndex === index ? "100%" : "0%" }} />
                </li>
              ))}
            </ul>
          </div>
          {/* === Desktop: Links === */}
          <div ref={liRef} className="mx-5 hidden lg:block absolute top-3 left-3 z-20 bg-warna1/25 backdrop-blur-md border border-warna1/20 shadow-md px-1 py-1 rounded-md overflow-hidden">
            <ul className="flex flex-row relative">
              <div ref={highlightRef} className="absolute top-0 left-0 h-full bg-warna2 rounded-md z-0" />
              {imageData.map((item, index) => (
                <li key={item.id} ref={(el) => (liRefs.current[index] = el)} onClick={() => handleLiClick(index)} className="px-5 py-3 text-xs cursor-pointer transition-all duration-900 text-center rounded-md relative z-10">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          {/* === Shared: Image & Overlay Content === */}
          <div className="relative w-full h-full flex items-center justify-start z-10">
            <img src={isMobile ? imageData[activeIndex].urlMobile : imageData[activeIndex].url} alt={imageData[activeIndex].title} className="w-full h-full object-cover rounded-xl" />

            {/* Overlay Awal (ScrollTrigger) - Desktop Only */}
            <div ref={overlayInitRef} className="lg:flex hidden absolute inset-0 bg-warna1 z-21 pointer-events-none" />

            {/* Overlay Klik (Transisi) - Desktop Only */}
            <div ref={overlayRef} className="lg:flex hidden absolute inset-0 bg-warna1 z-30 pointer-events-none" />

            {/* Info Box */}
            <div className="mx-10 absolute bottom-0 max-w-full h-50 md:h-35 md:max-w-xl lg:max-w-5xl lg:h-25 flex flex-col lg:flex-row items-start lg:items-center justify-center gap-5 m-5 p-5 rounded-xl z-20 bg-warna1/60 hover:bg-warna1/80 transition-all duration-300 backdrop-blur-md border border-warna1/20 shadow-md">
              <h2 ref={titleRef} className="text-xl lg:text-2xl font-medium text-warna2 text-left">
                {imageData[activeIndex].title}
              </h2>
              <p ref={descRef} className="text-xs w-full lg:w-md text-justify text-warna2 leading-relaxed">
                {imageData[activeIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedWorks;
