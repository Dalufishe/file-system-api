import { useEffect } from "react";
import "./App.css";
import FileSystem from "./components/FileSystem/FileSystem";
import ThreeApplication from "./three/yao.js";

function App() {
  useEffect(() => {
    ThreeApplication();
  });

  return (
    <div className="relative">
      <FileSystem />
      <canvas className="webgl"></canvas>
    </div>
  );
}

export default App;
