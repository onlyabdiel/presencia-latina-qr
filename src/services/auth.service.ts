import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = 'novafit_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(username: string, password: string): Promise<void> {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  const token = res.data.access_token;
  if (!token) throw new Error('No token received');
  localStorage.setItem(TOKEN_KEY, token);
}
