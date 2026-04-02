import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SpanHoverAnimations from "../../atoms/SpanHoverAnimations";
import LinkText from "../../atoms/LinkText";

// =====================================================
// ButtonNavMobile
// =====================================================

const ButtonNavMobile = forwardRef(({ onToggleOverlay }, ref) => {
  // -----------------------------------------------
  // Refs
  // -----------------------------------------------
  const container = useRef(null);
  const overlayRef = useRef(null);
  const menuRefs = useRef([]);
  const menuTextRef = useRef(null);
  const spanRef = useRef(null);

  // -----------------------------------------------
  // State
  // -----------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const menuItems = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Works", link: "/works" },
    { text: "Contact", link: "/contact" },
  ];

  // ===============================================
  // Initial setup (mirip PC, tapi ukuran mobile)
  // ===============================================
  useGSAP(
    () => {
      gsap.set(overlayRef.current, {
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        yPercent: 0,
        overwrite: "auto",
      });

      gsap.set(menuTextRef.current.element, { opacity: 0 });

      menuRefs.current.forEach((ref) => {
        if (ref?.element) {
          gsap.set(ref.element, { opacity: 0, y: 8 });
        }
      });
    },
    { scope: container }
  );

  // ===============================================
  // Handle toggle (OPEN / CLOSE)
  // ===============================================
  const handleBtnClick = () => {
    if (isAnimating) return;
    const next = !isOpen;
    setIsAnimating(true);
    onToggleOverlay(next);
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    if (next) {
      // OPEN
      tl.to(overlayRef.current, {
        width: "15rem",
        height: "15rem",
        borderRadius: "1.25rem",
        duration: 1.55,
        ease: "elastic.inOut(1, 1)",
        overwrite: "auto",
      });

      tl.call(
        () => {
          menuTextRef.current.animate();
          menuRefs.current.forEach((ref) => ref.animate());
        },
        null,
        "-=0.8"
      );
    } else {
      // CLOSE
      tl.call(() => {
        menuTextRef.current.animate2();
        menuRefs.current.forEach((ref) => ref.animate2());
      });

      tl.to(
        overlayRef.current,
        {
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          duration: 1.5,
          ease: "elastic.out(1, 0.9)",
          overwrite: "auto",
        },
        "+=0.45"
      );

      spanRef.current?.animateClose?.();
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
        width: "2.5rem",
        height: "2.5rem",
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

  useImperativeHandle(ref, () => ({ isAnimating, closeMenu }));
  // ===============================================
  // Render
  // ===============================================
  return (
    <div ref={container} className="absolute bottom-0 right-0 z-50">
      <div className="relative flex items-end justify-end">
        {/* Overlay panel */}
        <div ref={overlayRef} className="absolute bg-warna2 rounded-full  overflow-hidden">
          <div className="flex flex-col justify-between h-full p-4">
            <LinkText ref={menuTextRef} text="Menu" duration={0.4} className="text-warna1/60 text-[11px] uppercase" />

            <div className="flex flex-col gap-1">
              {menuItems.map((item, i) => (
                <LinkText key={i} ref={(el) => (menuRefs.current[i] = el)} text={item.text} link={item.link} duration={0.4} className="text-warna1 text-xl pb-0.5 uppercase" />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <SpanHoverAnimations ref={spanRef} className="relative z-10 flex items-center justify-center w-10 h-10" isClicked={isOpen} onClick={handleBtnClick} />
      </div>
    </div>
  );
});

export default ButtonNavMobile;
