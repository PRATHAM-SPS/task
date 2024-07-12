import React, { useState } from 'react';

function ObjectForm({ onAdd }) {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [animal, setAnimal] = useState('');
  const [thing, setThing] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, place, animal, thing });
    setName('');
    setPlace('');
    setAnimal('');
    setThing('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Place" />
      <input type="text" value={animal} onChange={(e) => setAnimal(e.target.value)} placeholder="Animal" />
      <input type="text" value={thing} onChange={(e) => setThing(e.target.value)} placeholder="Thing" />
      <button type="submit">Add</button>
    </form>
  );
}

export default ObjectForm;
