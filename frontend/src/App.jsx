import React from "react";
import NavBar from "./components/NavBar";
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
import { AuthProvider } from "./Context/AuthContext";
import CreateElection from "./pages/CreateElection";
import CreateElection1 from "./pages/CreateElection1";

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
    <AuthProvider>
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
            <Layout>
              <GetStarted />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login></Login>
            </Layout>
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
  );
};

export default App;
