import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import LinkText from "../atoms/LinkText";
// import { useDevice } from "../../context/DeviceProvider"; // Opsional jika tidak dipakai di logic
import HoverArrow from "../../animations/HoverArrow";

gsap.registerPlugin(ScrollTrigger);

function MyMission() {
  const container = useRef(null);
  const rightText = useRef(null);
  const rightTextPar = useRef(null);
  const leftText = useRef(null);
  const hoverText = useRef(null);

  // const { isMobile } = useDevice();

  useGSAP(
    () => {
      // Pastikan ref ada isinya sebelum animasi jalan (Safety Check)
      if (!rightText.current || !leftText.current || !hoverText.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%", // Sedikit dinaikkan dari 80% biar di HP kecil lebih cepet trigger
          // markers: true, // Matikan marker kalau sudah production
        },
      });

      // 1. RIGHT TEXT (Judul Besar)
      // Ganti ">-1" menjadi 0 (Absolute start) agar pasti jalan di awal
      tl.call(
        () => {
          rightText.current.animate();
          rightTextPar.current.animate();
        },
        null,
        0,
      )

        // 2. LEFT TEXT (Deskripsi)
        // Gunakan "+=0.2" artinya tunggu 0.2 detik DARI POSISI SEBELUMNYA
        .call(
          () => {
            leftText.current.animate();
          },
          null,
          "+=0.25",
        )

        // 3. HOVER ARROW (Tombol)
        // Jalan segera setelah left text terpanggil
        .call(
          () => {
            hoverText.current.show();
          },
          null,
          "+=0.1",
        );
    },
    { scope: container },
  );

  return (
    <div ref={container} className=" bg-warna1 flex items-center justify-center max-h-screen my-15 md:my-15 lg:my-20 w-screen px-3 md:px-8 lg:px-15  ">
      <div className=" max-h-[50vh] md:h-100 w-screen flex items-center justify-center flex-col md:flex-row py-10 md:py-0">
        {/* Left (Title) */}
        <div className=" h-full w-full flex flex-col items-start justify-center">
          <LinkText as="h1" duration={1.1} ref={rightText} className="text-2xl md:text-5xl w-25 md:w-1/3 text-start font-bold uppercase text-warna2" text="My Mission" />
        </div>

        {/* Right (Desc & Button) */}
        <div className="flex flex-col h-full w-full ">
          <div className=" h-full w-full flex flex-col items-start md:items-end md:pl-16 justify-end md:pt-8 gap-5 md:gap-0">
            <div className="flex flex-col justify-between md:justify-center lg:justify-center h-full w-150 gap-5 lg:gap-12">
              <LinkText as="p" duration={1.1} ref={rightTextPar} className="text-xs md:text-sm w-full md:w-1/2 text-start  text-warna2" text="Is To Craft digital experiences that just make sense — smooth, clean, and effortless." />
              <LinkText
                as="p"
                duration={1.1}
                ref={leftText}
                className="text-xs md:text-sm w-full md:w-85 lg:w-full font-normal text-warna2"
                text="It’s not just about making things look good — it’s about helping people feel good when they use them. Simplicity isn’t just design — it’s how we connect better with technology."
              />
              <HoverArrow ref={hoverText} direction="right" as="h3" duration={1.3} text="START A PROJECT" link="/projects" className="text-warna2 font-semibold text-xs uppercase" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyMission;
