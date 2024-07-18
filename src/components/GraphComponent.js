import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";
import axios from "axios";
import CredentialsPopup from "./CredentialsPopup";
import { text } from "d3";

const GraphComponent = ({ objectData, setObjectData, objectName }) => {
  const [attributes, setAttributes] = useState(objectData.attributes);
  const [fetchedAttributes, setFetchedAttributes] = useState(objectData.fetchedAttributes);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [showPopup, setShowPopup] = useState(false);
  const [linkingNode, setLinkingNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    setAttributes(objectData.attributes);
    setFetchedAttributes(objectData.fetchedAttributes);
    updateGraphData();
  }, [objectData]);

  // const graphConfig = {
  //   nodeHighlightBehavior: true,
  //   node: {
  //     color: "lightgreen",
  //     size: 300,
  //     highlightStrokeColor: "blue",
  //     labelProperty: "label",
  //   },
  //   link: {
  //     highlightColor: "lightblue",
  //     renderLabel: true,
  //     type: "dash",
  //   },
  //   d3: {
  //     linkLength: 400, // Adjust link length for clear visibility
  //   },
  // };
  
  const updateGraphData = () => {
    const nodes = [
      { id: "UserObject", color: "blue", label: "User Object", x: -300, y: 0 }, // Adjusted x position for User Object
      ...attributes.map((attr, index) => ({ id: `UserAttr${index}`, label: attr, x: -300, y: index * 100 + 100 })),
      { id: "FetchedObject", color: "green", label: "Fetched Object", x: 300, y: 0 }, // Adjusted x position for Fetched Object
      ...fetchedAttributes.map((attr, index) => ({ id: `FetchedAttr${index}`, label: attr, x: 300, y: index * 100 + 100 })),
    ];
  
    const links = [
      ...attributes.map((_, index) => ({ source: "UserObject", target: `UserAttr${index}` })),
      ...fetchedAttributes.map((_, index) => ({ source: "FetchedObject", target: `FetchedAttr${index}` })),
      ...Object.entries(objectData.mappings).map(([source, target]) => ({
        source,
        target,
        type: "dash",
        color: "purple",
      })),
    ];
  
    setGraphData({ nodes, links });
  };

  const handleAddAttribute = () => {
    const newAttr = prompt("Enter new attribute:");
    if (newAttr) {
      const newAttributes = [...attributes, newAttr];
      setAttributes(newAttributes);
      updateObjectData({ attributes: newAttributes });
    }
  };

  const handleEditAttribute = (index) => {
    const newAttr = prompt("Edit attribute:", attributes[index]);
    if (newAttr) {
      const newAttributes = [...attributes];
      newAttributes[index] = newAttr;
      setAttributes(newAttributes);
      updateObjectData({ attributes: newAttributes });
    }
  };

  const handleDeleteAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    const newMappings = { ...objectData.mappings };

    // Remove mappings related to the deleted attribute
    Object.keys(newMappings).forEach((key) => {
      if (key === `UserAttr${index}` || newMappings[key] === `UserAttr${index}`) {
        delete newMappings[key];
      }
    });

    // Rebuild the mappings with updated attribute indices
    const remappedMappings = {};
    Object.keys(newMappings).forEach((key) => {
      let newKey = key;
      let newValue = newMappings[key];
      if (key.startsWith("UserAttr")) {
        const oldIndex = parseInt(key.replace("UserAttr", ""), 10);
        const newIndex = oldIndex - (oldIndex > index ? 1 : 0);
        newKey = `UserAttr${newIndex}`;
      }
      if (newMappings[key].startsWith("UserAttr")) {
        const oldIndex = parseInt(newMappings[key].replace("UserAttr", ""), 10);
        const newIndex = oldIndex - (oldIndex > index ? 1 : 0);
        newValue = `UserAttr${newIndex}`;
      }
      remappedMappings[newKey] = newValue;
    });

    setAttributes(newAttributes);
    updateObjectData({ attributes: newAttributes, mappings: remappedMappings });
  };

  const handleConnector = () => {
    setShowPopup(true);
  };

  const handleSubmit = async (creds) => {
    setShowPopup(false);
    try {
      const response = await axios.post("http://localhost:5000/api/data", {
        connector: creds.connector,
        creds,
        attributes,
      });
      const newFetchedAttributes = response.data.attributes;
      setFetchedAttributes(newFetchedAttributes);
      updateObjectData({ fetchedAttributes: newFetchedAttributes });
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const handleLink = (source, target) => {
    if (source && target) {
      const newMappings = { ...objectData.mappings, [source]: target };
      setGraphData((prevData) => ({
        ...prevData,
        links: [...prevData.links, { source, target, type: "dash" }],
      }));
      updateObjectData({ mappings: newMappings });
    }
  };

  const handleRemoveLink = () => {
    if (selectedLink) {
      const { source, target } = selectedLink;
      const newMappings = { ...objectData.mappings };
      delete newMappings[source];

      setGraphData((prevData) => ({
        ...prevData,
        links: prevData.links.filter(
          (link) => link.source !== source || link.target !== target
        ),
      }));

      updateObjectData({ mappings: newMappings });
      setSelectedLink(null);
    }
  };

  const updateObjectData = (updatedFields) => {
    const updatedObjectData = { ...objectData, ...updatedFields };
    setObjectData(updatedObjectData);
    axios.put(`http://localhost:5000/api/objects/${objectName}`, updatedObjectData);
    updateGraphData(); // Update the graph data whenever object data is updated
  };

  const handleRenameObject = () => {
    const newName = prompt("Enter new object name:", objectName);
    if (newName && newName !== objectName) {
      axios.put(`http://localhost:5000/api/objects/${objectName}`, { ...objectData, name: newName }).then(() => {
        setObjectData((prevData) => ({ ...prevData, name: newName }));
        window.location.href = `/objects/${newName}`;
      });
    }
  };

  const graphConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 500,
      highlightStrokeColor: "blue",
      labelProperty: "label",
      textStyle: { size: 160 },
    },
    link: {
      highlightColor: "lightblue",
      renderLabel: true,
      type: "dash",
    },
    d3: {
      linkLength: 150,
    },
  };

  const handleGenerateJSON = () => {
    const mappedValues = {};
    Object.entries(objectData.mappings).forEach(([source, target]) => {
      const sourceValue = attributes.find((attr, index) => `UserAttr${index}` === source);
      const targetValue = fetchedAttributes.find((attr, index) => `FetchedAttr${index}` === target);
      mappedValues[sourceValue] = targetValue;
    });
  
    const jsonContent = JSON.stringify(mappedValues, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
  

  const handleClickNode = (nodeId) => {
    try {
      if (linkingNode) {
        handleLink(linkingNode, nodeId);
        setLinkingNode(null);
      } else {
        setLinkingNode(nodeId);
      }
    } catch (error) {
      console.error("Error linking nodes:", error);
    }
  };

  const handleClickLink = (source, target) => {
    setSelectedLink({ source, target });
  };

  return (
    <div>
      {/* <h1>Object: {objectData.name}</h1> */}
      <button onClick={handleAddAttribute}>Add Attribute</button>
      <button onClick={handleConnector}>Connector</button>
      <button onClick={handleGenerateJSON}>Generate JSON</button>
      <button onClick={handleRenameObject}>Rename Object</button>
      <button onClick={handleRemoveLink} disabled={!selectedLink}>Remove Selected Link</button>
      <div>
        <Graph
          id="graph-id"
          data={graphData}
          config={graphConfig}
          onClickNode={handleClickNode}
          onClickLink={handleClickLink}
        />
      </div>

      <div>
        <h2>Attributes</h2>
        <ul>
          {attributes.map((attr, index) => (
            <li key={index}>
              {attr}
              <button onClick={() => handleEditAttribute(index)}>Edit</button>
              <button onClick={() => handleDeleteAttribute(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {showPopup && <CredentialsPopup onSubmit={handleSubmit} />}
    </div>
  );
};

export default GraphComponent;
