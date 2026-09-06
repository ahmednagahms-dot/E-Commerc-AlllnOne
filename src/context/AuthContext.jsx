import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = Cookies.get("allinone_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    Cookies.set("allinone_user", JSON.stringify(userData), { expires: 7, sameSite: "strict" });
    Cookies.set("allinone_token", token, { expires: 7, sameSite: "strict" });
  };

  // تحديث بيانات اليوزر بس، من غير ما نلمس التوكن
  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set("allinone_user", JSON.stringify(userData), { expires: 7, sameSite: "strict" });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("allinone_user");
    Cookies.remove("allinone_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}