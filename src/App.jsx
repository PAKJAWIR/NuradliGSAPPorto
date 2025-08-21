import ScrollSmootherWrapper from "./component/ScrollSmootherWrapper";
import Navbar from "./component/Navbar.jsx";
import ButtonBottomRight from "./component/ButtonBottomRight.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/AppRoutes";

function App() {
  return (
    <>
      <ButtonBottomRight />
      <ScrollSmootherWrapper>
        <BrowserRouter>
          <Navbar />

          <AppRoutes />
        </BrowserRouter>
      </ScrollSmootherWrapper>
    </>
  );
}

export default App;
