import "./App.css";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import InternAdminPortal from "./pages/Admin/AdminPannel";

function App() {

  return (
    <Routes>
      <Route  path="/" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard />} />

      /*Admin Pannel*/
      <Route path="/adminPannel" element={<InternAdminPortal/>} />
    </Routes>
  );
}

export default App;
