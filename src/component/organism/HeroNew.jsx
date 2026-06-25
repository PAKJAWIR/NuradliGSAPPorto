import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function HeroNew({ navbarRef }) {
  const container = useRef(null);

  // Pastikan property casing sesuai dengan context provider kamu (isTablet / IsTablet)
  const { isMobile, isTablet } = useDevice();

  useGSAP(
    () => {
      if (isMobile || isTablet) return;

      const triggerBtn = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=200 top+=50",
        end: "top-=50 top",
        onEnter: () => navbarRef.current?.animateMove("up"),
        onEnterBack: () => navbarRef.current?.animateMove("down"),
      });

      return () => triggerBtn.kill();
    },
    { scope: container, dependencies: [isMobile, isTablet] }, // Tambahkan deps agar GSAP update saat resize
  );

  // Jalur video dinamis: Mobile pake versi rotate, Tablet & Desktop pake versi standar
  const activeVideoSrc = isMobile ? "/img/Rotatevids.webm" : "/img/vids.webm";

  return (
    <section ref={container} className="relative bg-warna1 h-[100dvh] w-screen px-4 py-6 md:p-6 overflow-hidden">
      {/* OPTIMASI: Menggunakan satu atribut src langsung.
        Atribut 'key' memaksa React me-remount tag video tepat saat mode layar berubah tanpa perlu refresh manual.
      */}
      <video
        key={isMobile ? "vid-mobile" : "vid-desktop"}
        src={activeVideoSrc}
        className="absolute w-full h-full inset-0 object-cover object-left lg:object-center rotate-180 md:rotate-0 gpu-fix will-change-transform"
        autoPlay
        muted
        playsInline
        loop
      />

      {/* Konten Teks */}
      <div className="flex items-end h-full w-full relative z-2 mix-blend-difference">
        <div className="h-full md:h-50 w-full flex flex-col md:flex-row items-start md:items-end justify-end md:justify-start gap-4 md:gap-24 mix-blend-difference will-change-transform">
          <h1 className="mix-blend-difference text-warna1 text-4xl md:text-6xl lg:text-8xl font-bold leading-6 md:leading-10 lg:leading-18">NURADLI</h1>
          <h2 className="mix-blend-difference text-warna1 text-xs md:text-sm font-bold">
            FRONT END DEVELOPER <br /> & GRAPHIC DESIGNER
          </h2>
        </div>
      </div>
    </section>
  );
}

export default HeroNew;
