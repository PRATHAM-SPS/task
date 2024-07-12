import React, { useState } from 'react';
import Graph from './components/Graph';
import AttributeModal from './components/AttributeModal';
import ConnectorPopup from './components/ConnectorPopup';
import CredentialsPopup from './components/CredentialsPopup';
import axios from 'axios';

function App() {
  const [attributes, setAttributes] = useState([]);
  const [fetchedAttributes, setFetchedAttributes] = useState([]);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [showConnectorPopup, setShowConnectorPopup] = useState(false);
  const [connector, setConnector] = useState(null);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);

  const fetchObject = (creds) => {
    axios.post(`http://localhost:5000/api/data`, { connector, creds, attributes })
      .then(response => {
        console.log(response.data);
        setFetchedAttributes(response.data.attributes);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const addAttribute = (attr) => {
    setAttributes([...attributes, attr]);
    setShowAttributeModal(false);
  };

  const handleConnectorSelection = (selectedConnector) => {
    setConnector(selectedConnector);
    setShowConnectorPopup(false);
    setShowCredentialsPopup(true);
  };

  return (
    <div className="App">
      <button onClick={() => setShowConnectorPopup(true)}>Select Connector</button>
      {showConnectorPopup && <ConnectorPopup onSelect={handleConnectorSelection} />}
      {showCredentialsPopup && <CredentialsPopup connector={connector} onSubmit={fetchObject} />}
      <button onClick={() => setShowAttributeModal(true)}>Add Attribute</button>
      {showAttributeModal && <AttributeModal onAdd={addAttribute} />}
      <Graph attributes={attributes} fetchedAttributes={fetchedAttributes} />
    </div>
  );
}

export default App;
