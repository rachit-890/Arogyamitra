import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email); // OAuth2 expects 'username'
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="card w-full max-w-md">
            <h2 className="text-3xl font-display font-bold text-center mb-8 bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">Welcome Back</h2>
            {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                        className="input-field"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        className="input-field"
                        placeholder="••••••••"
                    />
                </div>
                <button type="submit" className="btn-primary w-full py-3 text-lg mt-4">Sign In</button>
            </form>
            <p className="mt-6 text-center text-slate-400 text-sm">
                Don't have an account? <Link to="/register" className="text-primary hover:text-emerald-400 font-medium">Register here</Link>
            </p>
        </div>
    </div>
  );
};

export default Login;
