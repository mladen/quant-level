import React from 'react';

// Change the name of the component to reflect its specific purpose
const ForecastMethodology = ({ label, onSelect }) => {
  return (
    <div className="input-group">
      <label className="label">{label}:</label>
      <select onChange={e => onSelect(e.target.value)}>
        {/* Hard-coded options for forecast methodology */}
        <option value="">Select forecast methodology</option>
        <option value="method1">Methodology 1</option>
        <option value="method2">Methodology 2</option>
        <option value="method3">Methodology 3</option>
        {/* Add additional methodologies as needed */}
      </select>
    </div>
  );
};

export default ForecastMethodology;
