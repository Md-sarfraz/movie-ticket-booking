import React from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { Headphones, Info, Mail, X } from "lucide-react";

const links = [
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
  { to: "/support", label: "Help / Support", icon: Headphones },
];

const SidebarDrawer = ({ open, onClose }) => {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[1002] bg-black/45"
        onClick={onClose}
        aria-label="Close menu backdrop"
      />

      <aside className="fixed top-16 bottom-0 left-0 z-[1003] w-[82%] max-w-xs bg-white border-r border-gray-200 shadow-2xl md:hidden">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">Quick Menu</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="p-3 space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "border-transparent text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default SidebarDrawer;
