// src/components/store/Store.js
import React from 'react';
import './Store.css';

const Store = () => {
  return (
    <div className="store-page">
      <iframe
        src="https://store.flancraft.com/"
        className="store-iframe"
        title="Flancraft Store"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default Store;
