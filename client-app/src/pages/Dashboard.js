import React from 'react';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'unknown';

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! Your role is: {role}</p>
      {/* Add buttons to call operations, logout, etc */}
    </div>
  );
}
