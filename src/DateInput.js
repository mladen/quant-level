import React from 'react';

const DateInput = ({ label, name, onDateChange }) => {
  return (
    <div className="input-group">
      <label className="label">{label}:</label>
      <input 
        type="date" 
        name={name} 
        onChange={e => onDateChange(e.target.value)} 
      />
    </div>
  );
};

export default DateInput;
