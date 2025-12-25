// ================================================
// ButtonNav.jsx — Floating Navigation Button + GSAP Menu
// ================================================
// Catatan:
// File ini sudah ditata dengan komentar yang jelas agar
// developer lain bisa ngerti alur animasi, logika state,
// dan struktur GSAP tanpa mikir keras.
// ================================================

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "../atoms/LinkText";
import SpanHoverAnimations from "../atoms/SpanHoverAnimations";

gsap.registerPlugin(ScrollTrigger);

// ==============================================================
// ButtonNav component (button bulat yang membuka menu melayang)
// - Ada animasi overlay membesar/mengecil
// - Menu item muncul dengan animasi masing-masing
// - Bisa ditutup dari luar pakai ref (closeMenu)
// ==============================================================
const ButtonNav = forwardRef(({ onToggleOverlay }, ref) => {
  // -----------------------------------------------
  // Refs — akses langsung DOM + komponen animasi
  // -----------------------------------------------
  const container = useRef(null); // container utama component
  const overlayRef = useRef(null); // panel overlay yang diperbesar
  const menuRefs = useRef([]); // refs LinkText untuk setiap menu item
  const menuTextRef = useRef(null); // ref untuk teks "Menu"
  const spanRef = useRef(null); // ref untuk tombol utama (SpanHoverAnimations)

  // -----------------------------------------------
  // Local state
  // -----------------------------------------------
  const [isOpen, setIsOpen] = useState(false); // apakah menu sedang terbuka
  const [isAnimating, setIsAnimating] = useState(false); // kunci supaya double click nggak rusak animasi
  const [activeClick, setActiveClick] = useState("btnClick"); // mode layout menu (atas/bawah)

  // Menu items
  const menuItems = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Works", link: "/works" },
    { text: "Contact", link: "/contact" },
  ];

  // ==============================================================
  // GSAP INITIAL SETUP — basic position + ScrollTrigger mode
  // ==============================================================
  useGSAP(
    () => {
      // ScrollTrigger buat ubah ukuran/posisi overlay di posisi tertentu
      const trig = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=150 center-=50",
        end: "top-=50 top",
        toggleActions: "play none reverse none",
        onEnter: () => setActiveClick("btnClickVer2"), // mode ketika di scroll ke bawah
        onLeaveBack: () => setActiveClick("btnClick"), // mode default di atas
      });

      // Set kondisi overlay awal (kecil dan bulat)
      gsap.set(overlayRef.current, {
        width: "2.8rem",
        height: "2.8rem",
        borderRadius: "50%",
        yPercent: 0,
        overwrite: "auto",
      });

      // Text menu disembunyikan dulu
      gsap.set(menuTextRef.current.element, { opacity: 0 });

      return () => trig.kill();
    },
    { scope: container }
  );

  // ==============================================================
  // ANIMASI PERGERAKAN (programmatic) — untuk Navbar
  // ==============================================================
  const animateMove = (direction) => {
    if (!isOpen) return; // hanya jalan saat menu terbuka

    gsap.to(overlayRef.current, {
      yPercent: direction === "up" ? 80 : 0,
      duration: 3,
      ease: "elastic.out(1, 0.7)",
    });
  };

  // ==============================================================
  // HANDLE BUTTON CLICK — buka/tutup menu dengan animasi GSAP
  // ==============================================================
  const handleBtnClick = () => {
    if (isAnimating) return; // cegah spam klik
    setIsAnimating(true);
    const next = !isOpen; // toggle state
    onToggleOverlay(next); // kasih tahu Navbar

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    // 2 mode berbeda ukuran overlay (tergantung scroll)
    const overlayProps = {
      btnClick: { width: "14.5rem", height: "15.5rem", yPercent: 0 },
      btnClickVer2: { width: "16rem", height: "16rem", yPercent: 80 },
    };

    if (next) {
      // ----------------------------
      // OPEN MENU
      // ----------------------------
      tl.to(overlayRef.current, {
        borderRadius: "10%",
        duration: 1.5,
        ease: "elastic.out(1, 1)",
        ...overlayProps[activeClick],
        overwrite: "auto",
      });

      // Animasi muncul item menu
      tl.call(
        () => {
          menuTextRef.current.animate();
          menuRefs.current.forEach((ref) => ref.animate());
        },
        null,
        "-=1.35"
      );
    } else {
      // ----------------------------
      // CLOSE MENU
      // ----------------------------
      tl.call(() => {
        menuTextRef.current.animate2();
        menuRefs.current.forEach((ref) => ref.animate2());
      });

      tl.to(
        overlayRef.current,
        {
          borderRadius: "50%",
          width: "2.8rem",
          height: "2.8rem",
          yPercent: 0,
          duration: 1.6,
          ease: "elastic.out(1, 1)",
          overwrite: "auto",
        },
        "+=0.45"
      );
    }

    setIsOpen(next);
  };

  // ==============================================================
  // closeMenu() — dipanggil Navbar untuk tutup menu dari luar
  //  (OVERLAY CLOSE CLICK)
  // ==============================================================
  const closeMenu = () => {
    if (!isOpen || isAnimating) return;
    setIsOpen(false);
    setIsAnimating(true);
    onToggleOverlay(false);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Tutup animasi item
    tl.call(() => {
      menuTextRef.current.animate2();
      menuRefs.current.forEach((ref) => ref.animate2());
    });

    // Tutup overlay
    tl.to(
      overlayRef.current,
      {
        borderRadius: "50%",
        width: "2.8rem",
        height: "2.8rem",
        yPercent: 0,
        duration: 1.6,
        ease: "elastic.out(1, 1)",
        overwrite: "auto",
      },
      "+=0.45"
    );

    // Animasi tombol kembali
    spanRef.current?.animateClose();
  };

  // ==============================================================
  // Expose functions ke parent via ref
  // ==============================================================
  useImperativeHandle(ref, () => ({ animateMove, isAnimating, closeMenu }));

  // ==============================================================
  // RENDER
  // ==============================================================
  return (
    <div ref={container} className="relative w-full h-full">
      <div className="relative flex items-end justify-end h-full w-full p-5">
        {/* Overlay panel (menu background) */}
        <div ref={overlayRef} className="z-6 bg-warna2 rounded-full absolute flex shadow-sm shadow-warna2/30 overflow-hidden">
          <div className="flex flex-col gap-5 w-full h-full items-start justify-between p-5">
            {/* Teks "Menu" */}
            <div>
              <LinkText ref={menuTextRef} duration={0.5} text="Menu" className="text-warna1/65 text-xs uppercase" />
            </div>

            {/* List Menu */}
            <div className="flex flex-col gap-1">
              {menuItems.map((item, i) => (
                <LinkText key={i} ref={(el) => (menuRefs.current[i] = el)} duration={0.5} text={item.text} link={item.link} className="text-warna1 text-xl uppercase font-normal" />
              ))}
            </div>
          </div>
        </div>

        {/* Tombol utama */}
        <SpanHoverAnimations ref={spanRef} className="z-6 absolute smooth-item flex items-center justify-center w-11 h-11" isClicked={isOpen} onClick={handleBtnClick} />
      </div>
    </div>
  );
});

export default ButtonNav;
