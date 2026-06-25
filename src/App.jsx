import ScrollSmootherWrapper from "./component/ScrollSmootherWrapper";
import { DeviceProvider } from "./context/DeviceProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/AppRoutes";
import ProjectsDetail from "./animations/ProjectsDetail";
import { ProjectProvider } from "./context/ProjectContext";
import Footer from "./component/organism/Footer";
import { FaqProvider } from "./context/FaqContext";
import Faq from "./component/organism/Faq";
import FaqDetails from "./animations/FaqDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <DeviceProvider>
          <FaqProvider>
            <ProjectProvider>
              {/* MODALS OUTSIDE SMOOTHER */}
              <ProjectsDetail />
              <FaqDetails />

              {/* SMOOTHER */}
              <ScrollSmootherWrapper>
                <AppRoutes />
                <Footer />
              </ScrollSmootherWrapper>
            </ProjectProvider>
          </FaqProvider>
        </DeviceProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
