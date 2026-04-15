import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CreditCard, LogOut, Settings, Ticket, UserCircle2 } from "lucide-react";
import { clearAuthStorage } from "@/auth/storage";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const displayName = useMemo(() => {
    if (!user) return "Guest User";
    if (user.firstName || user.lastName) return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return user.username || "Guest User";
  }, [user]);

  const actions = [
    {
      title: "My Bookings",
      subtitle: "View your confirmed and upcoming tickets",
      icon: Ticket,
      onClick: () => navigate("/userDashboard/bookings"),
    },
    {
      title: "Payment History",
      subtitle: "See recent paid transactions",
      icon: CreditCard,
      onClick: () => navigate("/userDashboard/bookings"),
    },
    {
      title: "Settings",
      subtitle: "Update account details and preferences",
      icon: Settings,
      onClick: () => navigate("/userDashboard/settings"),
    },
  ];

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/loginPage");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-24 md:pt-24 md:pb-8 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={34} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{displayName}</h1>
              <p className="text-sm text-gray-500 truncate">{user?.email || "No email"}</p>
            </div>
          </div>
        </div>

        {actions.map(({ title, subtitle, icon: Icon, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className="w-full text-left rounded-2xl bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-3 hover:border-red-200 hover:bg-red-50/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full rounded-2xl border border-red-200 bg-white text-red-600 p-4 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
