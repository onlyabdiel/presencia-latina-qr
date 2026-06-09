import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getToken, clearToken, isTokenExpired } from '../services/auth.service';

export function RequireAuth() {
  const navigate = useNavigate();
  const authenticated = Boolean(getToken()) && !isTokenExpired();

  useEffect(() => {
    if (!authenticated) return;
    const id = setInterval(() => {
      if (!getToken() || isTokenExpired()) {
        clearToken();
        navigate('/login', { replace: true });
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [authenticated, navigate]);

  if (!authenticated) {
    clearToken();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
