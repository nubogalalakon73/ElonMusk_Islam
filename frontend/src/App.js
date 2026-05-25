import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Landing from "@/pages/Landing";
import ReadBab1 from "@/pages/ReadBab1";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import GrainOverlay from "@/components/GrainOverlay";

function App() {
  return (
    <div className="App">
      <GrainOverlay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/read/bab-1" element={<ReadBab1 />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success/:token" element={<Success />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            border: "1px solid rgba(197,160,89,0.3)",
            color: "#F5F5F0",
            fontFamily: "Manrope, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
