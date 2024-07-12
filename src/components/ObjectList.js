import React from 'react';

function ObjectList({ objects }) {
  return (
    <ul>
      {objects.map((obj, index) => (
        <li key={index}>{`Name: ${obj.name}, Place: ${obj.place}, Animal: ${obj.animal}, Thing: ${obj.thing}`}</li>
      ))}
    </ul>
  );
}

export default ObjectList;
