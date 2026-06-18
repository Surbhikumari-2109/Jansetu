import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateComplaint from "./pages/CreateComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import OfficerDashboard from "./pages/OfficerDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/create-complaint"
          element={<CreateComplaint />}
        />

        <Route
          path="/my-complaints"
          element={<MyComplaints />}
        />
        <Route
  path="/complaints/:id"
  element={<ComplaintDetails />}
/>
<Route
  path="/officer"
  element={<OfficerDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;