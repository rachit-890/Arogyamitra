import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Profile Setup', path: '/profile-setup' },
    { name: 'Workout Plan', path: '/workout' },
    { name: 'Nutrition Plan', path: '/nutrition' },
    { name: 'Progress Checks', path: '/progress' },
    { name: 'AI Coach (AROMI)', path: '/chat' },
  ];

  return (
    <div className="w-64 glass h-screen fixed left-0 top-0 flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-primary mb-8 tracking-wider">ArogyaMitra</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-all duration-200 font-medium ` +
                (isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
