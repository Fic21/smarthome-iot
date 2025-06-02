'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // penting agar cookie diikutkan
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Login failed');
      } else {
        // jika berhasil login maka localstorage,message,direct to dasboard user
        localStorage.setItem('currentUserId',data.user.id);
        localStorage.setItem('currentUserName',data.user.name);
        setMessage(`Welcome, ${data.user.name}`);
        window.location.href = '/dasboard/users'; // pakai folder sesuai milikmu
      }
    } catch (err) {
      setMessage('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-gray-700 font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-semibold">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold transition-colors
            ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-6 text-center font-medium ${
            message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </main>
  );
}
