import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError, type User } from '../../lib/api';
import '../../assets/styles/UsersPages.css';

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    api
      .getUser(id, token)
      .then(setUser)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load user'));
  }, [id, token]);

  async function handleDelete() {
    if (!token || !id || !user) return;
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteUser(id, token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user');
      setIsDeleting(false);
    }
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text" role="alert">
          {error}
        </p>
        <Link className="btn" to="/">
          Back to users
        </Link>
      </div>
    );
  }

  if (!user) {
    return <div className="page">Loading…</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{user.username}</h1>
        <div className="page-actions">
          <Link className="btn" to="/">
            Back
          </Link>
          <Link className="btn btn-primary" to={`/users/${user.id}/edit`}>
            Edit
          </Link>
          <button className="btn btn-danger" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      <dl className="detail-grid">
        <dt>First name</dt>
        <dd>{user.firstName}</dd>

        <dt>Middle name</dt>
        <dd>{user.middleName ?? '—'}</dd>

        <dt>Last name</dt>
        <dd>{user.lastName}</dd>

        <dt>Date of birth</dt>
        <dd>{user.dateOfBirth ?? '—'}</dd>

        <dt>Created by</dt>
        <dd>{user.createdBy ?? '—'}</dd>

        <dt>Created date</dt>
        <dd>{new Date(user.createdDate).toLocaleString()}</dd>

        <dt>Last updated by</dt>
        <dd>{user.lastUpdatedBy ?? '—'}</dd>

        <dt>Last updated date</dt>
        <dd>{new Date(user.lastUpdatedDate).toLocaleString()}</dd>
      </dl>
    </div>
  );
}
