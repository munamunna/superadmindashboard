import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserManagement = () => {
  const { accessToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", username: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching users with token:", accessToken);
      const res = await axios.get("http://127.0.0.1:8000/api/auth/users/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Users fetched:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://127.0.0.1:8000/api/auth/users/create/",
      newUser,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    alert(`User created!\nPassword: ${res.data.auto_password}`);
    setNewUser({ email: "", username: "" });
    fetchUsers();
  };

  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      <h2 className="text-2xl mb-4">User Management</h2>

      {error && (
        <div className="bg-red-600 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-center p-4">Loading users...</div>
      )}

      <form onSubmit={createUser} className="mb-6 flex gap-2">
        <input
          type="email"
          placeholder="Email"
          className="p-2 text-black rounded"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Username"
          className="p-2 text-black rounded"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <button className="bg-blue-600 px-4 py-2 rounded">Add User</button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-700">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Username</th>
            <th className="p-2">Super Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border-t border-slate-700">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.is_super_admin ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
