import { useRef } from "react";
import Navbar from "../organism/Navbar";
import Hero from "../organism/Hero";
import AboutMeLandingPage from "../organism/AboutMeLandingPage.jsx";
import SelectedProject from "../organism/SelectedProject.jsx";
import MyMission from "../organism/MyMission.jsx";
import Faq from "../organism/Faq.jsx";
import HeroNew from "../organism/HeroNew.jsx";
import SelectedProjectssNew from "../organism/SelectedProjectssNew.jsx";

function HomeLayout() {
  const navbarRef = useRef(null);

  return (
    <>
      <Navbar ref={navbarRef} />
      <HeroNew navbarRef={navbarRef} />
      <AboutMeLandingPage />
      <SelectedProjectssNew />
      <div className="bg-warna1 h-screen w-screen"></div>
      <div className="bg-warna1 h-screen w-screen"></div>
      <div className="bg-warna1 h-screen w-screen"></div>

      {/* 
      <Faq /> */}
    </>
  );
}

export default HomeLayout;
