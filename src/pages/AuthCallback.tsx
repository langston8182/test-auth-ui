import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';

interface UserInfo {
  given_name: string;
  family_name: string;
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [protectedError, setProtectedError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        // Première étape : échanger le code contre un token
        const authResponse = await fetch(`https://test.cyrilmarchive.com/auth/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!authResponse.ok) {
          throw new Error('Échec de l\'authentification');
        }

        // Deuxième étape : récupérer les informations utilisateur
        const userResponse = await fetch('https://test.cyrilmarchive.com/userinfo', {
          method: 'POST',
          credentials: 'include',
        });

        if (!userResponse.ok) {
          throw new Error('Échec de la récupération des informations utilisateur');
        }

        const data = await userResponse.json();
        setUserInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    handleAuthentication();
  }, [searchParams]);

  const handleProtectedCall = async () => {
    try {
      setProtectedError(null);
      const response = await fetch('https://test.cyrilmarchive.com/protected', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Échec de l\'accès aux données protégées');
      }

      const data = await response.json();
      setProtectedData(JSON.stringify(data, null, 2));
    } catch (err) {
      setProtectedError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Chargement en cours...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bonjour, {userInfo?.given_name} {userInfo?.family_name}!
        </h1>
        <div>
        <p className="text-gray-600 mb-6">
          Vous êtes maintenant connecté avec succès.
        </p>
                <button
          onClick={handleProtectedCall}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-4"
        >
          Accéder aux données protégées
        </button>
        </div>

        {protectedError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{protectedError}</p>
          </div>
        )}

        {protectedData && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {protectedData}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}