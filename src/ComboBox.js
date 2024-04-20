import React from 'react';

const ComboBox = ({ label, name, options, onSelect }) => {
  return (
    <div className="input-group">
      <label className="label">{label}:</label>
      <input 
        type="text" 
        list={`${name}Options`} 
        onChange={e => onSelect(e.target.value)}
        placeholder={`Select ${label.toLowerCase()}`}
      />
      <datalist id={`${name}Options`}>
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </div>
  );
};

export default ComboBox;
