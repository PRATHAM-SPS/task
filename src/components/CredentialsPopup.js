import React, { useState } from 'react';

function CredentialsPopup({ connector, onSubmit }) {
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [spaceId, setSpaceId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (connector === 'mongodb') {
      onSubmit({ host, username, password, database });
    } else if (connector === 'contentful') {
      onSubmit({ apiKey, spaceId });
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        {connector === 'mongodb' && (
          <>
            <label>
              Host:
              <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
            </label>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
              Database:
              <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} />
            </label>
          </>
        )}
        {connector === 'contentful' && (
          <>
            <label>
              API Key:
              <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </label>
            <label>
              Space ID:
              <input type="text" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} />
            </label>
          </>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CredentialsPopup;
