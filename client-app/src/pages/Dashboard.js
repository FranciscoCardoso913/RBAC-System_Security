import React, { useState } from 'react';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'unknown';
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [addUserSuccess, setAddUserSuccess] = useState(null);

  const operations = ['op1', 'op2', 'op3', 'op4', 'op5'];

  async function callOperation(op) {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const port = ['op4', 'op5'].includes(op) ? 5002 : 5001;
      const response = await fetch(`https://localhost:${port}/${op}`, {
        method: op === 'op2' ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
        },
        credentials: 'include',
        ...(op === 'op2' ? { body: JSON.stringify({}) } : {}),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error calling operation');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const jwt = localStorage.getItem('jwt');
      await fetch('https://localhost:4000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      localStorage.removeItem('publicKey');
      window.location.href = '/';
    }
  }

  // 🔐 Only Admins Can See This
  function AddUserForm() {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newRole, setNewRole] = useState('');

    async function handleAddUser(e) {
 
      e.preventDefault();
      setAddUserError(null);
      setAddUserSuccess(null);

      try {

        const res = await fetch('https://localhost:4000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          body: JSON.stringify({ username, password, role: newRole }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add user');
        setAddUserSuccess(`User "${username}" created successfully.`);
        setUsername('');
        setPassword('');
        setNewRole('');
      } catch (err) {
        setAddUserError(err.message);
      }
    }

    return (
      <div style={styles.addUserContainer}>
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>

          <button type="submit" style={styles.opButton}>Create User</button>
        </form>
        {addUserError && <p style={styles.error}>⚠️ {addUserError}</p>}
        {addUserSuccess && <p style={{ color: 'green' }}>{addUserSuccess}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Dashboard</h2>
        <p>Your role: <strong>{role}</strong></p>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.operations}>
        {operations.map((op) => (
          <button
            key={op}
            onClick={() => callOperation(op)}
            style={styles.opButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : op.toUpperCase()}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>⚠️ {error}</div>}
      {result && (
        <div style={styles.resultBox}>
          <strong>Result:</strong>
          <pre style={styles.result}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {role === 'admin' && <AddUserForm />}
    </div>
  );
}


const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  header: {
    marginBottom: '2rem',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right',
  },
  operations: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  opButton: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
  resultBox: {
    marginTop: '1rem',
    backgroundColor: '#f6f8fa',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #dcdcdc',
  },
  result: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  addUserContainer: {
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
  },
  input: {
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
  },
};
