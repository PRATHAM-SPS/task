import React from 'react';

function ConnectorPopup({ onSelect }) {
  return (
    <div className="popup">
      <h2>Select Connector</h2>
      <button onClick={() => onSelect('mongodb')}>MongoDB</button>
      <button onClick={() => onSelect('contentful')}>Contentful</button>
    </div>
  );
}

export default ConnectorPopup;
