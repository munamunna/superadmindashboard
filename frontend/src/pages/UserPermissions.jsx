import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PAGES = [
  "products", "marketing", "orders", "media", "offers", "clients",
  "suppliers", "support", "sales", "finance"
];

const UserPermissionsTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editPermissions, setEditPermissions] = useState({});
  const [saving, setSaving] = useState(false);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://127.0.0.1:8000/api/auth/user-permissions/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionForPage = (permissions, page) => {
    const perm = permissions.find((p) => p.page_name === page);
    if (!perm) return "—";
    const flags = [];
    if (perm.can_view) flags.push("View");
    if (perm.can_create) flags.push("Create");
    if (perm.can_edit) flags.push("Edit");
    if (perm.can_delete) flags.push("Delete");
    return flags.join(", ") || "—";
  };

  const startEditing = (user) => {
    setEditingUser(user.id);
    // Initialize edit permissions from user's current permissions
    const perms = {};
    PAGES.forEach(page => {
      const existing = user.permissions.find(p => p.page_name === page);
      perms[page] = {
        can_view: existing?.can_view || false,
        can_create: existing?.can_create || false,
        can_edit: existing?.can_edit || false,
        can_delete: existing?.can_delete || false,
      };
    });
    setEditPermissions(perms);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditPermissions({});
  };

  const togglePermission = (page, permType) => {
    setEditPermissions(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [permType]: !prev[page][permType]
      }
    }));
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      setError(null);

      // Save permissions for each page
      for (const page of PAGES) {
        const perms = editPermissions[page];
        await axios.post(
          "http://127.0.0.1:8000/api/auth/permissions/",
          {
            user: editingUser,
            page_name: page,
            ...perms
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      // Refresh the data
      await fetchPermissions();
      setEditingUser(null);
      setEditPermissions({});
    } catch (err) {
      console.error("Error saving permissions:", err);
      setError("Failed to save permissions: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-4">User Permissions</h2>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-center p-4">Loading permissions...</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-sm text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="border border-gray-600 px-4 py-2 sticky left-0 bg-slate-700">Username</th>
              {PAGES.map((page) => (
                <th key={page} className="border border-gray-600 px-4 py-2 capitalize">
                  {page}
                </th>
              ))}
              <th className="border border-gray-600 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800">
                <td className="border border-gray-600 px-4 py-2 font-medium sticky left-0 bg-slate-900">
                  {user.username}
                  {user.is_super_admin && (
                    <span className="text-xs text-blue-400 ml-2">(Admin)</span>
                  )}
                </td>
                {PAGES.map((page) => (
                  <td key={page} className="border border-gray-600 px-2 py-2">
                    {editingUser === user.id ? (
                      <div className="flex flex-col gap-1 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editPermissions[page]?.can_view || false}
                            onChange={() => togglePermission(page, 'can_view')}
                            className="cursor-pointer"
                          />
                          <span>View</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editPermissions[page]?.can_create || false}
                            onChange={() => togglePermission(page, 'can_create')}
                            className="cursor-pointer"
                          />
                          <span>Create</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editPermissions[page]?.can_edit || false}
                            onChange={() => togglePermission(page, 'can_edit')}
                            className="cursor-pointer"
                          />
                          <span>Edit</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editPermissions[page]?.can_delete || false}
                            onChange={() => togglePermission(page, 'can_delete')}
                            className="cursor-pointer"
                          />
                          <span>Delete</span>
                        </label>
                      </div>
                    ) : (
                      <div className="text-center text-xs">
                        {getPermissionForPage(user.permissions, page)}
                      </div>
                    )}
                  </td>
                ))}
                <td className="border border-gray-600 px-4 py-2">
                  {editingUser === user.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={savePermissions}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-xs disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(user)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPermissionsTable;
