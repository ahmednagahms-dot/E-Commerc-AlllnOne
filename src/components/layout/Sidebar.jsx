import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { LogOut, X } from "lucide-react";
import { sidebarLinks } from "../../data/sidebarLinks";
import { useAuth } from "../../context/AuthContext";

const STORE_LOGO_URL = "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-white text-gray-700 flex flex-col border-r border-gray-100">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <div className="w-20 h-14 border-none overflow-hidden shrink-0 ">
            <img src={STORE_LOGO_URL} alt="AllInOne" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-gray-900">AllInOne</h1>
            <p className="text-xs text-gray-400">E-commerce Admin</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sidebarLinks.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="px-5 text-[11px] text-gray-400 mb-2 font-semibold tracking-wide">{group.section}</p>
            {group.items.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-2 text-sm transition ${
                      isActive
                        ? "bg-primary-50 text-primary-600 font-medium border-r-2 border-primary-500"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}