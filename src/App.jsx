import ScrollSmootherWrapper from "./component/ScrollSmootherWrapper";
import { DeviceProvider } from "./context/DeviceProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/AppRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <DeviceProvider>
          <ScrollSmootherWrapper>
            <AppRoutes />
          </ScrollSmootherWrapper>
        </DeviceProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
