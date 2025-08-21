import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Magnet from "./Animations/Magnet/Magnet";
import { FiArrowUp } from "react-icons/fi";

function ButtonBottomRight() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div key="back-to-top" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={{ duration: 0.8, ease: "easeOut" }} className="fixed bottom-4 right-4 z-50">
          <Magnet padding={40} magnetStrength={4}>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-3 rounded-md shadow-lg backdrop-blur-xs bg-warna1/10 text-warna2
                transition-all duration-300
                hover:bg-warna3/5 hover:text-warna3"
            >
              <FiArrowUp className="text-base font-bold md:text-lg" />
            </button>
          </Magnet>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ButtonBottomRight;
