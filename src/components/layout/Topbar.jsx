import { Bell, Menu, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
          <Menu size={20} />
        </button>
        <h2 className="text-sm font-semibold text-gray-700 hidden sm:block">AllInOne Admin</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center overflow-hidden font-semibold text-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : user?.username ? (
              user.username.charAt(0).toUpperCase()
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}