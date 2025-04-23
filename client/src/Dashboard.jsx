import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Function to handle redirection to the "Add Patient" form
  const handleAddPatient = () => {
    navigate("/patients");
  };

  // Function to handle redirection to the "Look Up Patient" page
  const handleLookUpPatient = () => {
    navigate("/patientList"); // Replace this with the actual path to your LookUp Patient page
  };

  // Function to handle user logout (optional, can be used for redirecting to login)
  const handleLogout = () => {
    navigate("/login"); // Redirect to login page on logout
  };

  return (
    <div className="d-flex vh-100">
      {/* Left design section */}
      <div
        className="bg-light p-5 d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          width: "50%", // Left section takes half the screen width
          height: "100vh", // Full viewport height
        }}
      >
        <h1 className="display-3 text-primary">Hospital Data Management</h1>
        <p className="lead text-muted">
          Manage hospital data efficiently and securely.
        </p>
      </div>

      {/* Right form section */}
      <div
        className="bg-white p-5 shadow-lg rounded d-flex flex-column justify-content-center align-items-center"
        style={{
          width: "50%", // Right section takes the other half of the screen width
          height: "100vh", // Full viewport height
        }}
      >
        <h2 className="text-center mb-4">Hospital Dashboard</h2>

        <div className="d-flex flex-column w-100">
          {/* Add New Patient Button */}
          <button
            onClick={handleAddPatient}
            className="btn btn-primary w-100 mb-3"
          >
            Add New Patient
          </button>

          {/* Look Up Patient Button */}
          <button
            onClick={handleLookUpPatient}
            className="btn btn-primary w-100 mb-3"
          >
            Look Up Patient
          </button>

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-danger w-100">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
