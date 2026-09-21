import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api, ApiError } from '../../lib/api';
import '../../assets/styles/UsersPages.css';

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined;
  const { token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode || !token || !id) return;

    api
      .getUser(id, token)
      .then((user) => {
        setUsername(user.username);
        setFirstName(user.firstName);
        setMiddleName(user.middleName ?? '');
        setLastName(user.lastName);
        setDateOfBirth(user.dateOfBirth ?? '');
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load user'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    if (!isEditMode && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await api.updateUser(
          id,
          {
            firstName,
            middleName: middleName || undefined,
            lastName,
            dateOfBirth: dateOfBirth || undefined,
          },
          token,
        );
        navigate(`/users/${id}`, { replace: true });
      } else {
        const created = await api.createUser(
          {
            username,
            password,
            firstName,
            middleName: middleName || undefined,
            lastName,
            dateOfBirth: dateOfBirth || undefined,
          },
          token,
        );
        navigate(`/users/${created.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="page">Loading…</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit user' : 'Add user'}</h1>
        <Link className="btn" to={isEditMode ? `/users/${id}` : '/'}>
          Cancel
        </Link>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {!isEditMode && (
          <>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <p className="field-hint">Letters and numbers only, 3–50 characters.</p>

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="field-hint">At least 8 characters, with uppercase, lowercase, a number and a symbol.</p>

            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="middleName">Middle name (optional)</label>
        <input
          id="middleName"
          name="middleName"
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="dateOfBirth">Date of birth</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
