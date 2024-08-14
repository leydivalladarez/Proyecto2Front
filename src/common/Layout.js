import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header onLogout={onLogout} />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
