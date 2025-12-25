import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../component/pages/Home";
import About from "../component/pages/About";
import Works from "../component/pages/Works";
import NotFound from "../component/pages/NotFound";
import Navbar from "../component/organism/Navbar";

export default function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/works" element={<Works />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
