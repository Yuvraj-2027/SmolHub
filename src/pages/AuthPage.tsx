import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ConfirmationModal from '../components/ConfirmationModal';

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      if (type === 'email_confirmation' && token_hash) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email_confirmation'
          });
          
          if (error) throw error;
          
          alert('Email confirmed successfully! Please sign in.');
          navigate('/auth');
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });
        
        if (error) throw error;

        if (user && isAdmin) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: user.id, role: 'admin' }]);

          if (roleError) throw roleError;
        }
        
        setShowConfirmation(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw error;
        }
        
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <span className="text-yellow-400 text-3xl">🚀</span>
          <span className="ml-2 text-white text-2xl font-semibold">SmolHub</span>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => {
              setIsAdmin(false);
              setError('');
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              !isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            User
          </button>
          <button
            onClick={() => {
              setIsAdmin(true);
              setError('');
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Admin
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignUp ? 'Create an Account' : 'Sign In'} as {isAdmin ? 'Admin' : 'User'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
              disabled={isLoading}
            />
            {isSignUp && (
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm text-blue-400 hover:text-blue-300"
            disabled={isLoading}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          navigate('/auth');
        }}
        email={email}
      />
    </div>
  );
}

export default AuthPage;