import { useRef } from "react";
import Navbar from "../organism/Navbar";
import Hero from "../organism/Hero";
import AboutMeLandingPage from "../organism/AboutMeLandingPage.jsx";
import SelectedProjectssNew from "../organism/SelectedProjectssNew.jsx";
import MyMission from "../organism/MyMission.jsx";
import Faq from "../organism/Faq.jsx";
import HeroNew from "../organism/HeroNew.jsx";
import HowIWork from "../organism/HowIWork.jsx";
import TestingAnimation from "../../animations/TestingAnimation.jsx";

function HomeLayout() {
  const navbarRef = useRef(null);

  return (
    <>
      <Navbar ref={navbarRef} />
      <HeroNew navbarRef={navbarRef} />

      <AboutMeLandingPage />
      <HowIWork />
      <SelectedProjectssNew />

      <Faq />
    </>
  );
}

export default HomeLayout;
