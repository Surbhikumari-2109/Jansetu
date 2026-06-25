import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateComplaint from "./components/CreateComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerComplaintDetails from "./pages/OfficerComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDirectory from './pages/UserDirectory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES (Anyone can access) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* CITIZEN PROTECTED ROUTES (Only accessible with 'citizen' role) */}
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-complaint"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* OFFICER PROTECTED ROUTES (Only accessible with 'officer' or 'admin' roles) */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRoles={["officer", "admin"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/complaint/:id"
          element={
            <ProtectedRoute allowedRoles={["officer", "admin"]}>
              <OfficerComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* 🔒 ADMIN PROTECTED ROUTE (Only accessible with 'admin' role) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* WORKER PROTECTED ROUTES (Only accessible with 'worker' role) */}
        <Route
          path="/worker-dashboard"
          element={ 
            <ProtectedRoute allowedRoles={["worker"]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        // Example using a custom ProtectedRoute wrapper
<Route 
  path="/user-directory" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UserDirectory />
    </ProtectedRoute>
  } 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
