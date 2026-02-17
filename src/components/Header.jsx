import React from 'react';

// Simple header - you can make it fancy with Material-UI later
const Header = ({ onLogoClick }) => {
  return (
    <header style={{
      padding: '20px',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <span 
          onClick={onLogoClick}
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#333'
          }}
        >
          Nabbit
        </span>
      </div>
    </header>
  );
};

export default Header;