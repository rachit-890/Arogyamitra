import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 md:ml-64 relative min-h-screen">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <main className="p-8 max-w-7xl mx-auto z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
