import React from "react";
import NavBar from "./components/NavBar";
import ToastContainer from "./components/ToastContainer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Elections from "./pages/Elections";
import MeetingVotes from "./pages/MeetingVotes";
import Services from "./pages/Services";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectRoute from "./components/ProtectRoute";
import GuestRoute from "./components/GuestRoute";
import { AuthProvider } from "./Context/AuthContext";
import { ToastProvider } from "./Context/ToastContext";
import CreateElection from "./pages/CreateElection";


const Layout = ({ children }) => {
  return (
    <div>
      <NavBar></NavBar>
      {children}
      <Footer></Footer>
    </div>
  );
};
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/elections"
            element={
              <Layout>
                <Elections />
              </Layout>
            }
          />
          <Route
            path="/meeting-votes"
            element={
              <Layout>
                <MeetingVotes />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/get-started"
            element={
              <GuestRoute>
                <Layout>
                  <GetStarted />
                </Layout>
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Layout>
                  <Login></Login>
                </Layout>
              </GuestRoute>
            }
          />
          <Route path="/pricing" />

          <Route
            path="/dashboard"
            element={
              <ProtectRoute>
                <Dashboard></Dashboard>
              </ProtectRoute>
            }
          ></Route>
          <Route
            path="create-election"
            element={
              <ProtectRoute>
                <Layout>
                  <CreateElection></CreateElection>
                </Layout>
              </ProtectRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
