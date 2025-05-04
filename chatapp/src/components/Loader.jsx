import React from 'react';

const Loader = () => {
  const containerStyle = {
    backgroundColor: '#1c1d25',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dotContainerStyle = {
    display: 'flex',
    gap: '12px',
  };

  const dotStyle = {
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: '#6ea8f8',
    animation: 'bounce 0.6s infinite alternate',
  };

  return (
    <div style={containerStyle}>
      <div style={dotContainerStyle}>
        <div style={{ ...dotStyle, animationDelay: '0s' }}></div>
        <div style={{ ...dotStyle, animationDelay: '0.2s' }}></div>
        <div style={{ ...dotStyle, animationDelay: '0.4s' }}></div>
      </div>

      <style>
        {`
          @keyframes bounce {
            from {
              transform: translateY(0);
              opacity: 0.6;
            }
            to {
              transform: translateY(-20px);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
