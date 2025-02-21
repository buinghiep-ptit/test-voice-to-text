/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

const Bubble = lazy(() => import("./pages/Bubble"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  return (
    <Router>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/bubble" element={<Bubble />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
