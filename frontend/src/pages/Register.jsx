import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10"></div>

        <div className="card w-full max-w-md">
            <h2 className="text-3xl font-display font-bold text-center mb-8 bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">Create Account</h2>
            {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input 
                        type="text" required 
                        value={formData.name} 
                        onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                        className="input-field" placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input 
                        type="email" required 
                        value={formData.email} 
                        onChange={(e)=>setFormData({...formData, email: e.target.value})} 
                        className="input-field" placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                        type="password" required 
                        value={formData.password} 
                        onChange={(e)=>setFormData({...formData, password: e.target.value})} 
                        className="input-field" placeholder="••••••••"
                    />
                </div>
                <button type="submit" className="btn-primary w-full py-3 text-lg mt-4">Sign Up</button>
            </form>
            <p className="mt-6 text-center text-slate-400 text-sm">
                Already have an account? <Link to="/login" className="text-primary hover:text-emerald-400 font-medium">Log in</Link>
            </p>
        </div>
    </div>
  );
};

export default Register;
