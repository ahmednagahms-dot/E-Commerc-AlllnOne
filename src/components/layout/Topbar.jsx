import { Bell, Menu, User } from "lucide-react";
import * as Icons from "lucide-react";
import { useLocation } from "react-router-dom";
import { sidebarLinks } from "../../data/sidebarLinks";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../ui/LanguageSwitch";

const allPages = sidebarLinks.flatMap((group) =>
  group.items.map((item) => ({ ...item, section: group.section })),
);

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const currentPage = allPages.find((item) => item.path === pathname);
  const PageIcon = Icons[currentPage?.icon] || Icons.LayoutDashboard;
  const pageTitle = currentPage?.label || "Dashboard";
  const pageSection = currentPage?.section || "MAIN";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <PageIcon size={16} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {pageTitle}
            </h2>
          </div>
        </div>
      </div>


      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button className="relative text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center overflow-hidden font-medium text-sm shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : user?.username ? (
              user.username.charAt(0).toUpperCase()
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
