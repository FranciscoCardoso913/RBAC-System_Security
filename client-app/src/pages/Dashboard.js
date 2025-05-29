import React, { useState } from 'react';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'unknown';
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to call backend ops
  async function callOperation(op) {
    setError(null);
    setResult(null);

    try {
      let response;
      if (op === 'op4' || op === 'op5') {
        response = await fetch(`https://localhost:5002/${op}`, {
          method: op === 'op2' ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          credentials: 'include',
          ...(op === 'op2' ? { body: JSON.stringify({}) } : {}),
        });
      } else {
        response = await fetch(`https://localhost:5001/${op}`, {
          method: op === 'op2' ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
          },
          credentials: 'include',
          ...(op === 'op2' ? { body: JSON.stringify({}) } : {}),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error calling operation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // 🔒 Logout function
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
      // Clear session on client side
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      window.location.href = '/'; // or redirect to login
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! Your role is: {role}</p>

      <div style={{ marginBottom: '1rem' }}>
        {['op1', 'op2', 'op3', 'op4', 'op5'].map((op) => (
          <button
            key={op}
            onClick={() => callOperation(op)}
            style={{ marginRight: '0.5rem' }}
          >
            {op.toUpperCase()}
          </button>
        ))}
        <button onClick={handleLogout} style={{ marginLeft: '1rem', color: 'red' }}>
          Logout
        </button>
      </div>

      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div>
          <strong>Result:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
