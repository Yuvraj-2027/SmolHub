import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import HomePage from './pages/HomePage';
import ModelPage from './pages/ModelPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import UploadModelPage from './pages/UploadModelPage';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={session ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="/"
          element={session ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/model/:id"
          element={session ? <ModelPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={session ? <ProfilePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/upload-model"
          element={session ? <UploadModelPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </Router>
  );
}

export default App;