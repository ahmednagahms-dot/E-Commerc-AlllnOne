import React, { useState } from "react";
import { deleteUser, updateUser } from "../../api/user.api";

const UsersTable = ({ users, setUsers, onEditClick }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedViewUser, setSelectedViewUser] = useState(null);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeletingId(userToDelete);
    try {
      await deleteUser(userToDelete);
      const updatedUsers = users.filter((u) => u._id !== userToDelete);
      setUsers(updatedUsers);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Delete Erorr.!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVerify = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await updateUser(id, { isVerified: !currentStatus });

      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, isVerified: !currentStatus } : u,
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating verification:", error);
      alert("Edit Erorr.!");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm bg-gray-200 text-gray-500">
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Verified</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* <td className="p-4 flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </td> */}
              <td className="p-4">
                <div
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => setSelectedViewUser(user)}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:opacity-80 transition-opacity">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {user?.username}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span
                  className={`bg-blue-50 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    user?.role?.toLowerCase() === "customer"
                      ? "text-green-800"
                      : "text-purple-800"
                  }`}
                >
                  {user?.role}
                </span>
              </td>
              <td className="p-4">
                {user?.isVerified ? (
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    Verified
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center gap-1">
                    Not Verified
                  </span>
                )}
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditClick(user)}
                    title="Edit User"
                    style={{ backgroundColor: "#0284C7" }}
                    className="text-white w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      handleToggleVerify(user._id, user.isVerified)
                    }
                    disabled={updatingId === user._id}
                    title={
                      user.isVerified ? "Remove Verification" : "Verify User"
                    }
                    className={`text-white w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors shadow-sm ${
                      updatingId === user._id
                        ? "bg-emerald-400 cursor-wait"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {updatingId === user._id ? (
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    title="Delete User"
                    className="text-white w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors shadow-sm bg-red-500 hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-6 text-gray-500">
                Not Found Users!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Sidebar / Aside Overlay */}
      {selectedViewUser && (
        <div className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedViewUser(null)}
          ></div>

          <aside className="relative w-full md:w-1/2 h-screen bg-white shadow-2xl z-[70] flex flex-col animate-slide-in-right overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedViewUser?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedViewUser?.username}
                  </h2>
                  <span
                    className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                      selectedViewUser?.role?.toLowerCase() === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedViewUser?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedViewUser(null)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1 bg-gray-50/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      ></path>
                    </svg>
                    Total Orders
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Current
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-green-100 bg-green-50/50 shadow-sm">
                  <div className="text-green-600 text-sm font-medium flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Paid
                  </div>
                  <div className="text-2xl font-extrabold text-green-700">
                    0
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-red-100 bg-red-50/50 shadow-sm">
                  <div className="text-red-500 text-sm font-medium flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Cancelled
                  </div>
                  <div className="text-2xl font-extrabold text-red-600">0</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                  Contact Info
                </h3>
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="font-medium">
                      {selectedViewUser?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <span className="font-medium">
                      {selectedViewUser?.phone || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                  Addresses
                </h3>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium">
                    No saved addresses.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl transform transition-all scale-100 opacity-100 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Are you sure to delete him/her ?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              If you delete it, you won't be able to recover its data. This step
              is final.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait shadow-sm shadow-red-200"
              >
                {deletingId !== null ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting in progress...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
