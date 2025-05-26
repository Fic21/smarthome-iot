'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('api/auth/register', {  // pastikan API path sesuai
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Something went wrong');
      } else {
        setMessage(`User created: ${data.user.name} (${data.user.email})`);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-gray-700 font-semibold">Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your full name"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            minLength={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="At least 6 characters"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold transition-colors
            ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Registering...' : 'Register'}
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
