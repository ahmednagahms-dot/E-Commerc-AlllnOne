import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { LogOut, X, User } from "lucide-react";
import { sidebarLinks } from "../../data/sidebarLinks";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Sidebar({ onClose }) {
  const { logoutUser, user } = useAuth();
  const {t} = useTranslation();

  return (
    <aside className="sidebar-edge w-64 h-screen bg-slate-900 text-slate-300 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-16 h-14 rounded-2xl bg-white shrink-0">
            <img
              src={STORE_LOGO_URL}
              alt="AllInOne"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-medium text-sm text-white">AllInOne</h1>
            <p className="text-[11px] text-slate-400">{t("common.admin")}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sidebarLinks.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="px-2 text-[11px] text-slate-500 mb-2 font-medium tracking-wide">
              {t(group.section)}
            </p>
            {group.items.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-lg text-sm transition ${
                      isActive
                        ? "bg-primary-600/20 text-primary-300 font-medium"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  {t(item.label)}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-medium shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : user?.username ? (
              user.username.charAt(0).toUpperCase()
            ) : (
              <User size={14} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {user?.username}
            </p>
            <p className="text-slate-500 text-[11px] capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logoutUser();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={18} />
          {t("navigation.logout")}
        </button>
      </div>
    </aside>
  );
}