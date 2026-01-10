import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import PresentationCanvas from "./components/PresentationCanvas";

function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
        <PresentationCanvas />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
