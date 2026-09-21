import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError, type User } from '../../lib/api';
import '../../assets/styles/UsersPages.css';

export function UsersListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function loadUsers() {
    if (!token) return;
    api
      .getUsers(token)
      .then(setUsers)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load users'));
  }

  useEffect(loadUsers, [token]);

  async function handleDelete(user: User) {
    if (!token) return;
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

    setDeletingId(user.id);
    setError(null);
    try {
      await api.deleteUser(user.id, token);
      setUsers((current) => current.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/users/new">
            + Add user
          </Link>
        </div>
      </div>

      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Date of birth</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                {user.firstName} {user.middleName ? `${user.middleName} ` : ''}
                {user.lastName}
              </td>
              <td>{user.dateOfBirth ?? '—'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn" onClick={() => navigate(`/users/${user.id}`)}>
                    View
                  </button>
                  <button className="btn" onClick={() => navigate(`/users/${user.id}/edit`)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={deletingId === user.id}
                    onClick={() => handleDelete(user)}
                  >
                    {deletingId === user.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
