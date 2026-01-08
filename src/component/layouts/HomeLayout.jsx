import { useRef } from "react";
import Navbar from "../organism/Navbar";
import Hero from "../organism/Hero";

function HomeLayout() {
  const navbarRef = useRef(null);

  return (
    <>
      <Navbar className="z-50" ref={navbarRef} />
      <Hero navbarRef={navbarRef} />

      <div className="bg-warna1 h-screen w-screen flex items-center justify-center"></div>
      <div className="bg-warna1 h-screen w-screen flex items-center justify-center"></div>
    </>
  );
}

export default HomeLayout;
