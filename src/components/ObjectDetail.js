import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GraphComponent from "./GraphComponent";

const ObjectDetail = () => {
  const { name } = useParams();
  const [objectData, setObjectData] = useState(null);

  useEffect(() => {
    fetchObjectData();
  }, [name]);

  const fetchObjectData = async () => {
    const response = await axios.get(`http://localhost:5000/api/objects/${name}`);
    setObjectData(response.data);
  };

  return (
    <div>
      <h1>Object: {name}</h1>
      {objectData && (
        <GraphComponent
          objectData={objectData}
          setObjectData={setObjectData}
          objectName={name}
        />
      )}
    </div>
  );
};

export default ObjectDetail;
