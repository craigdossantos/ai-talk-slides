import { ReactFlowProvider } from "@xyflow/react";
import MetroCanvas from "./components/MetroCanvas";
import "@xyflow/react/dist/style.css";
import "./index.css";
import "./App.css";

function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <MetroCanvas />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
