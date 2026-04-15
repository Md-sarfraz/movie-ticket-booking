import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, Clapperboard, Film, Home, UserRound } from "lucide-react";
import { getStoredAuth } from "@/auth/storage";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/event", label: "Events", icon: CalendarDays },
  { to: "/userDashboard/bookings", label: "Bookings", icon: Clapperboard },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { token } = getStoredAuth();

  const handleProtectedNav = (to) => {
    const requiresAuth = to === "/userDashboard/bookings" || to === "/profile";
    if (requiresAuth && !token) {
      navigate("/loginPage");
      return;
    }
    navigate(to);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1001] md:hidden border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
      <ul className="grid grid-cols-5 px-1 py-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={(e) => {
                e.preventDefault();
                handleProtectedNav(to);
              }}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition-all ${
                  isActive
                    ? "text-red-600 bg-red-50"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
