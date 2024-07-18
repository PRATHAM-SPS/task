import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';

const ObjectList = () => {

  const [objects, setObjects] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchObjects();
  }, []);

  const fetchObjects = async () => {
    const response = await axios.get("http://localhost:5000/api/objects");
    setObjects(response.data);
  };

  const createObject = async () => {
    const objectName = prompt("Enter object name:");
    if (objectName) {
      try {
        await axios.post("http://localhost:5000/api/objects", { name: objectName });
        fetchObjects(); // Assuming this function fetches and updates the object list
      } catch (error) {
        console.error("Error creating object:", error);
      }
    }
  };

  const deleteObject = async (name) => {
    await axios.delete(`http://localhost:5000/api/objects/${name}`);
    fetchObjects();
  };

  const viewObject = (name) => {
    history.push(`/objects/${name}`);
  };

  return (
    <div>
      <button onClick={createObject}>Create New Object</button>
      <ul>
        {objects.map((obj) => (
          <li key={obj.name}>
            {obj.name}
            <button onClick={() => viewObject(obj.name)}>View</button>
            <button onClick={() => deleteObject(obj.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectList;
