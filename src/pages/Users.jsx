import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UsersTable from "../components/users/UsersTable";
import UserFormModal from "../components/users/UserFormModal";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchUsers } from "../api/user.api";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

const Users = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        console.log("API Response:", response);

        const fetchedData =
          response.data?.users || response.data?.data || response.data;

        setUsers(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
         toast.error("Failed to load users.");
      }
    };

    loadUsers();
  }, []);

  const safeUsers = Array.isArray(users) ? users : [];

  const totalUsers = safeUsers.length;
  const adminsCount = safeUsers.filter(
    (u) => u?.role === "admin" || u?.role === "ADMIN",
  ).length;
  const customersCount = safeUsers.filter(
    (u) => u?.role === "customer" || u?.role === "CUSTOMER",
  ).length;
  const verifiedCount = safeUsers.filter((u) => u?.isVerified).length;

  const filteredUsers = safeUsers.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      {isPageLoading ? (
        <PageLoader text="Loading users..." />
      ) : (
      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p style={{ color: "#4F46E5" }} className="font-semibold tracking-wider text-sm mb-1">
              USER MANAGEMENT
            </p>
            <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search users..."
              className="border border-gray-300 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-blue-200 shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: "#4F46E5" }}
              className="text-white px-6 py-2 rounded-full font-medium focus:scale-90 hover:scale-102 transition-all shadow-md hover:shadow-lg"
            >
              + Add User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center hover:-translate-y-2 transition-all duration-300 ease-in-out">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <div
              style={{ backgroundColor: "#2563EB" }}
              className="text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center hover:-translate-y-2 transition-all duration-300 ease-in-out">
            <div>
              <p className="text-gray-500 text-sm">Admins</p>
              <p className="text-2xl font-bold">{adminsCount}</p>
            </div>
            <div
              style={{ backgroundColor: "#7C3AED" }}
              className="text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.97A12.055 12.055 0 003 10.5c0 2.68 1.419 4.793 3.65 6.55A12.016 12.016 0 0012 22.5c2.535 0 4.887-.803 6.85-2.046 2.23-1.757 3.65-3.87 3.65-6.55V6.97c-.898-.592-2.05-1.11-3.42-1.554A25.8 25.8 0 0112 4.5c2.192 0 4.256.32 6.08.915 1.37.444 2.522.962 3.42 1.554z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center hover:-translate-y-2 transition-all duration-300 ease-in-out">
            <div>
              <p className="text-gray-500 text-sm">Customers</p>
              <p className="text-2xl font-bold">{customersCount}</p>
            </div>
            <div
              style={{ backgroundColor: "#0D9488" }}
              className="text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center hover:-translate-y-2 transition-all duration-300 ease-in-out">
            <div>
              <p className="text-gray-500 text-sm">Verified</p>
              <p className="text-2xl font-bold">{verifiedCount}</p>
            </div>
            <div
              style={{ backgroundColor: "#D97706" }}
              className="text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
          </div>
        </div>
        <UsersTable
          users={filteredUsers}
          setUsers={setUsers}
          onEditClick={(user) => {
            setEditingUser(user);
            setIsModalOpen(true);
          }}
        />

        {isModalOpen && (
          <UserFormModal
            closeModal={() => {
              setIsModalOpen(false);
              setEditingUser(null);
            }}
            setUsers={setUsers}
            editingUser={editingUser}
          />
        )}
      </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
