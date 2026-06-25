import { useDevice } from "../../context/DeviceProvider";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextHeadingAnimation from "../../animations/TextHeadingAnimation";

// Registrasi Plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CENTRALIZED DATA (TEXT & CARDS)
// ==========================================
const WORKFLOW_DATA = {
  header: {
    tagline: "HOW I WORK",
    heading: "My workflow moves between concept and execution, balancing visual intuition with structured thinking. Each stage refines the previous one until the outcome feels both intentional and inevitable.",
    description:
      "From early exploration to final deployment, every step is approached as part of a continuous system. The aim is not simply to build interfaces, but to shape systems that remain clear, even as they grow in scale and complexity.",
  },
  cards: [
    {
      id: 1,
      title: "Ideas",
      desc: "Every project begins with a moment of quiet observation. I translate scattered intentions into clear conceptual directions, shaping the foundation before the form begins to emerge.",
    },
    {
      id: 2,
      title: "Design",
      desc: "Concepts gradually evolve into visual structures. Through layout, typography, and motion, I establish hierarchy and rhythm, allowing the interface to communicate with clarity and balance.",
    },
    {
      id: 3,
      title: "Code",
      desc: "Design systems are translated into functional architecture. Components, interactions, and performance are refined carefully to ensure the experience remains fluid and scalable.",
    },
    {
      id: 4,
      title: "Launch",
      desc: "Release marks the transition from concept to living product. Continuous refinement, feedback, and performance tuning guide the work toward its most resolved form.",
    },
  ],
};

function HowIWork() {
  const { isMobile, isTablet } = useDevice();
  const { header, cards } = WORKFLOW_DATA;

  const container = useRef(null);
  const cardContainer = useRef(null);
  const taglineRef = useRef(null);

  // ==========================================
  // GSAP ANIMATION LOGIC
  // ==========================================
  useGSAP(
    () => {
      if (!container.current || !cardContainer.current) return;

      const targets = gsap.utils.toArray(".workflow-card");
      const gridWrapper = cardContainer.current.querySelector(".grid");

      // Master Reset: Bersihkan inline style bawaan GSAP saat breakpoint berganti
      gsap.killTweensOf([gridWrapper, targets]);
      gsap.set([gridWrapper, targets], { clearProps: "all" });

      // 1. DESKTOP & TABLET ANIMATION
      if (!isMobile && !isTablet) {
        gsap.set(cardContainer.current, { xPercent: 20 });
        gsap.set(targets, { yPercent: (i) => (i + 1) * 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top+=18% center",
            end: "bottom center",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(cardContainer.current, { xPercent: 0 }, 0).to(targets, { yPercent: 0 }, 0);
      }

      // ==========================================
      // 2. MOBILE ANIMATION (Subtle Scale Stacking)
      // ==========================================
      if (isMobile && gridWrapper) {
        // Wrapper dipasang relative agar posisi absolute anak-anaknya presisi
        gsap.set(gridWrapper, { position: "relative", height: "38svh" });

        // Setup awal tumpukan kartu
        gsap.set(targets, {
          position: "absolute",
          inset: 0,
          transformOrigin: "top center", // Tumpuan mengecil di tengah atas agar rapi
          zIndex: (i) => (i === 0 ? 1 : 5 - i),
          yPercent: (i) => (i === 0 ? 0 : 110),
        });

        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: `+=${cards.length * 100}%`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Jalankan animasi urutan kartu
        targets.forEach((card, index) => {
          if (index === 0) return;

          const label = `step-${index}`;

          // Kartu baru bergerak naik ke atas
          tlMobile.set(card, { zIndex: 10 + index }, label).to(
            card,
            {
              yPercent: 0,
              ease: "none",
            },
            label,
          );

          // Efek subtle scale: Kartu di bawahnya mengecil sedikit (turun 3% per tumpukan)
          for (let j = 0; j < index; j++) {
            const depth = index - j;
            tlMobile.to(
              targets[j],
              {
                scale: 1 - depth * 0.1, // Kartu langsung di bawahnya jadi 0.97
                ease: "none",
              },
              label,
            );
          }
        });
      }
    },
    { scope: container, dependencies: [isMobile, isTablet] },
  );

  return (
    <div ref={container} className="min-h-svh md:h-svh lg:h-[110svh] my-4 md:my-0 w-screen p-4 md:p-6 overflow-hidden">
      {/* Parents */}
      <div className="flex flex-col justify-around gap-6 md:gap-0 w-full h-full">
        {/* Top Section */}
        <div className="flex items-center h-fit md:h-full w-full ">
          <div className="flex flex-col-reverse gap-10 md:flex-row h-fit justify-between w-full">
            {/* Text Left */}
            <div className="flex flex-col gap-12 items-start justify-center h-full w-full">
              <TextHeadingAnimation
                text={header.heading}
                startDesktop="top center+=18%"
                endDesktop="center top+=20%"
                scrubDesktop={1.1}
                disableAnimation={isMobile}
                className="text-xl md:text-2xl lg:text-3xl font-bold w-full md:w-[66dvw] lg:w-[60%] will-change-opacity inline-block"
                containerClassName="!h-fit !justify-start !items-start"
              />
              <p className="text-xs w-[84dvw] md:w-[48dvw] lg:w-[28dvw]">{header.description}</p>
            </div>
            {/* Text Right */}
            <div className="flex h-full w-fit md:w-1/5 justify-end">
              <h3 ref={taglineRef} className="text-sm font-bold">
                {header.tagline}
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Cards Wrapper */}
        <div ref={cardContainer} className="flex h-fit lg:h-[60svh] w-full pt-4 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
            {cards.map((card) => (
              <div key={card.id} className="shadow-md md:shadow-sm workflow-card flex flex-col justify-around bg-warna3 rounded-md p-4 md:p-6 h-full min-h-[20svh] md:min-h-[26svh] will-change-transform">
                {/* Number & Title */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs text-warna2/70 font-medium">{String(card.id).padStart(2, "0")}.</span>
                  <h3 className="text-lg font-bold">{card.title}</h3>
                </div>

                {/* Description */}
                <p className="text-xs w-full text-warna2/70">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowIWork;
