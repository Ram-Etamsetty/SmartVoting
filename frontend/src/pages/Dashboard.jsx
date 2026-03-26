import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import { ButtonSpinner, SkeletonLoader } from "../components/Spinners";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ProfileModal from "../components/ProfileModal";

const StatusBadge = ({ status }) => {
  const styles = {
    draft: "bg-gray-100 text-gray-500",
    active: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inter-font text-xs font-semibold px-3 py-1 rounded-full capitalize ${styles[status] || styles.draft}`}
    >
      {status || "draft"}
    </span>
  );
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="inter-font text-gray-600 text-sm font-medium">
            {label}
          </p>
          <p className="inter-font text-3xl font-bold text-[#00263A] mt-2">
            {value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

const ElectionCard = ({ election, onDelete, onView }) => {
  const [deleting, setDeleting] = useState(false);
  const { error } = useToast();

  const format = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this election?"))
      return;
    setDeleting(true);
    try {
      await onDelete(election._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 px-6 py-4 flex items-center justify-between hover:shadow-md hover:border-[#F28A36]/40 transition-all duration-200 rounded-lg">
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="inter-font text-[#00263A] font-semibold text-base">
          {election.title}
        </h3>
        {election.description && (
          <p className="inter-font text-gray-400 text-xs max-w-md truncate">
            {election.description}
          </p>
        )}
        <p className="inter-font text-gray-400 text-xs">
          {format(election.startDate)} — {format(election.endDate)}
        </p>
      </div>
      <div className="flex items-center gap-5 shrink-0">
        <StatusBadge status={election.status} />
        <button
          onClick={() => onView(election._id)}
          className="inter-font text-sm text-blue-600 hover:text-blue-700 cursor-pointer transition font-medium"
        >
          View
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inter-font text-sm text-red-600 hover:text-red-700 cursor-pointer transition font-medium disabled:opacity-50"
        >
          {deleting ? <ButtonSpinner size="sm" /> : "Delete"}
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setElections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Failed to fetch Elections", err);
        error("Failed to load elections");
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, [token, error]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/elections/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setElections((prev) => prev.filter((e) => e._id !== id));
      success("Election deleted successfully");
    } catch (err) {
      console.log("Delete Failed", err);
      error("Failed to delete election");
    }
  };

  const handleView = (id) => {
    // TODO: Navigate to election details page
    console.log("View election:", id);
  };

  const handleLogout = () => {
    logout();
    success("Logged out successfully");
    navigate("/");
  };

  const stats = {
    total: elections.length,
    active: elections.filter((e) => e.status === "active").length,
    draft: elections.filter((e) => e.status === "draft").length,
    closed: elections.filter((e) => e.status === "closed").length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar onProfileClick={() => setProfileModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-[#FAFAFA] px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="inter-font text-[32px] font-semibold text-[#262D34] mb-2">
              Dashboard
            </h1>
            <p className="inter-font text-gray-600">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          {/* Create Election Button */}
          <div className="mb-8 flex justify-end">
            <NavLink
              to="/create-election"
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold text-md inter-font rounded-md bg-[#00263A] hover:bg-[#001a28] transition shadow-md"
            >
              🗳️ Create Election
            </NavLink>
          </div>

          {/* Stats Grid */}
          {!loading && elections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon="📊"
                label="Total Elections"
                value={elections.length}
              />
              <StatCard
                icon="🟢"
                label="Active"
                value={elections.filter((e) => e.status === "active").length}
              />
              <StatCard
                icon="📝"
                label="Draft"
                value={elections.filter((e) => e.status === "draft").length}
              />
              <StatCard
                icon="✓"
                label="Closed"
                value={elections.filter((e) => e.status === "closed").length}
              />
            </div>
          )}

          {/* Elections List */}
          {loading ? (
            <SkeletonLoader count={3} />
          ) : elections.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">🗳️</div>
              <h2 className="varela-font text-2xl font-bold text-[#00263A] mb-2">
                No Elections Yet
              </h2>
              <p className="inter-font text-gray-600 mb-6">
                Create your first election to get started
              </p>
              <NavLink
                to="/create-election"
                className="inline-block px-8 py-3 text-white font-semibold text-md inter-font rounded-md bg-[#00263A] hover:bg-[#001a28] transition"
              >
                Create Election
              </NavLink>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="inter-font text-[24px] font-semibold text-[#262D34]">
                  Your Elections
                </h2>
                <span className="inter-font text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  {elections.length} total
                </span>
              </div>
              <div className="space-y-3">
                {elections.map((election) => (
                  <ElectionCard
                    key={election._id}
                    election={election}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;
