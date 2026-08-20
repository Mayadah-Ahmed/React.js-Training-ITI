import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Todos from "./components/Todos";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/contacts" element={<ContactUs />} />
      </Routes>
    </>
  );
}

export default App;