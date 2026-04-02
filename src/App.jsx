import ScrollSmootherWrapper from "./component/ScrollSmootherWrapper";
import { DeviceProvider } from "./context/DeviceProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/AppRoutes";
import ProjectsDetail from "./animations/ProjectsDetail";
import { ProjectProvider } from "./context/ProjectContext";
import Footer from "./component/organism/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <DeviceProvider>
          <ProjectProvider>
            <ProjectsDetail />
            <ScrollSmootherWrapper>
              <AppRoutes />
              <Footer />
            </ScrollSmootherWrapper>
          </ProjectProvider>
        </DeviceProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
