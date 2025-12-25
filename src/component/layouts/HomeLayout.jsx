import { useRef } from "react";
import Navbar from "../organism/Navbar";
import Hero from "../organism/Hero";
import AboutMeLandingPage from "../organism/AboutMeLandingPage";
import MyPhilosophyLP from "../organism/MyPhilosophyLP";

function HomeLayout() {
  const navbarRef = useRef(null);

  return (
    <>
      <Navbar ref={navbarRef} />
      <Hero navbarRef={navbarRef} />
      <AboutMeLandingPage />
      <MyPhilosophyLP/>
      <div className="bg-warna1 h-screen w-screen"></div>
    </>
  );
}

export default HomeLayout;
