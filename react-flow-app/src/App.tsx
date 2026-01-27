import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import MetroCanvas from "./components/MetroCanvas";
import ResourcesPage from "./components/pages/ResourcesPage";
import "@xyflow/react/dist/style.css";
import "./index.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <ReactFlowProvider>
                <MetroCanvas />
              </ReactFlowProvider>
            </div>
          }
        />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
