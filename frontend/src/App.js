import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, RoleRoute } from "./components/RouteGuards";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Stores from "./pages/Stores";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddUser from "./components/AddUser";
import UsersTable from "./components/UsersTable";
import UserDetails from "./components/UserDetails";
import EditUser from "./components/EditUser";
import AdminStoresTable from "./components/AdminStoresTable";
import StoreDetails from "./components/StoreDetails";
import EditStore from "./components/EditStore";
import Footer from "./components/Footer";

// temporary placeholder page for store owners
const OwnerDashboard = () => <div className="container py-3"><h3>Owner Dashboard</h3></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Flex container for sticky footer */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          {/* Main content area */}
          <div className="container py-3" style={{ flex: "1 0 auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stores" element={<PrivateRoute><Stores /></PrivateRoute>} />
              <Route path="/dashboard" element={<RoleRoute roles={["ADMIN"]}><Dashboard /></RoleRoute>} />
              <Route path="/owner" element={<RoleRoute roles={["OWNER"]}><OwnerDashboard /></RoleRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/add-user" element={<AddUser />} />
              <Route path="/admin/users" element={<UsersTable />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/users/:id/edit" element={<EditUser />} />
              <Route path="/admin/stores" element={<AdminStoresTable />} />
              <Route path="/admin/stores/:id" element={<StoreDetails />} />
              <Route path="/admin/stores/:id/edit" element={<EditStore />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Footer sticks to bottom */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
