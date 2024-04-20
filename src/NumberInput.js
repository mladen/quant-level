import React from 'react';

const NumberInput = ({ label, name, value, onNumberChange, min, max }) => {
  return (
    <div className="input-group">
      <label className="label">{label}:</label>
      <input 
        type="number" 
        name={name} 
        min={min}
        max={max}
        value={value}
        onChange={onNumberChange}   
      />
    </div>
  );
};

export default NumberInput;
