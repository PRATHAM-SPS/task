import React, { useState } from "react";
import axios from "axios";

const CredentialsPopup = ({ onSubmit }) => {
  const [creds, setCreds] = useState({
    connector: "",
    username: "",
    password: "",
    host: "",
    database: "",
    spaceId: "",
    apiKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreds((prevCreds) => ({
      ...prevCreds,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(creds);
  };

  return (
    <div className="popup" style={{ position: "fixed", top: "10px", left: "65%", transform: "translateX(-50%)" }}>
      <h2>Enter Credentials</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Connector:
          <select name="connector" value={creds.connector} onChange={handleChange}>
            <option value="">Select Connector</option>
            <option value="mongodb">MongoDB</option>
            <option value="contentful">Contentful</option>
          </select>
        </label>
        {creds.connector === "mongodb" && (
          <>
          <br />
            <label>
              
              Username:
              <input type="text" name="username" value={creds.username} onChange={handleChange} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" value={creds.password} onChange={handleChange} />
            </label>
            <br />
            <label>
              Host:
              <input type="text" name="host" value={creds.host} onChange={handleChange} />
            </label>
            <br />
            <label>
              Database:
              <input type="text" name="database" value={creds.database} onChange={handleChange} />
            </label>
          </>
        )}
        {creds.connector === "contentful" && (
          <>
          <br />
            <label>
              Space ID:
              <input type="text" name="spaceId" value={creds.spaceId} onChange={handleChange} />
            </label>
            <br />
            <label>
              API Key:
              <input type="text" name="apiKey" value={creds.apiKey} onChange={handleChange} />
            </label>
          </>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CredentialsPopup;
