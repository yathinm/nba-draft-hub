import { Routes, Route } from "react-router-dom";
import BigBoard from "./pages/BigBoard";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BigBoard />} />
      <Route path="/player/:id" element={<PlayerProfile />} />
    </Routes>
  );
}

export default App;
