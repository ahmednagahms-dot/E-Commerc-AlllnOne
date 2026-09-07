import Cookies from "js-cookie";

const UsersTable = ({ users, setUsers }) => {
  const handleDelete = (id) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    Cookies.set("users", JSON.stringify(updatedUsers), { expires: 7 });
  };

  const handleToggleVerify = (id) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, verified: !u.verified } : u,
    );
    setUsers(updatedUsers);
    Cookies.set("users", JSON.stringify(updatedUsers), { expires: 7 });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Verified</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="p-4 flex items-center gap-4">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </td>
              <td className="p-4">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  {user?.role}
                </span>
              </td>
              <td className="p-4">
                {user?.verified ? (
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
                    title="Edit User"
                    className="bg-blue-500 text-white w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
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
                    title={
                      user.verified ? "Remove Verification" : "Verify User"
                    }
                    onClick={() => handleToggleVerify(user.id)}
                    className="bg-emerald-500 text-white w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-sm"
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
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </button>

                  <button
                    title="Delete User"
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
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
    </div>
  );
};

export default UsersTable;
