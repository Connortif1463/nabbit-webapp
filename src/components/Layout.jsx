import React from 'react';

const Layout = ({ children }) => {
  return (
    <main style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '0 20px',
      minHeight: 'calc(100vh - 100px)'
    }}>
      {children}
    </main>
  );
};

export default Layout;