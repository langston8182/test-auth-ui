import React from 'react';
import { LogIn } from 'lucide-react';

export default function Home() {
  const handleLogin = () => {
    window.location.href = 'https://auth.cyrilmarchive.com/login?client_id=2pbnovhfp5d069b2tu51n5tsg9&response_type=code&scope=email+openid+profile&redirect_uri=https://testui.cyrilmarchive.com/auth/callback';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome
        </h1>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          <LogIn className="w-5 h-5" />
          Se connecter
        </button>
      </div>
    </div>
  );
}