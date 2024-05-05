import React from 'react';

const ForecastMethodology = ({ label, onSelect, selectedMethodology }) => {
  return (
    <div className="input-group">
        <label className="label">{label}:</label>
        <select value={selectedMethodology} onChange={e => onSelect(e.target.value)}>
            <option value="">Select forecast methodology</option>
            <option value="method1">Methodology 1</option>
            <option value="method2">Methodology 2</option>
            <option value="random">Random Selection</option>
        </select>
    </div>
  );
};

export default ForecastMethodology;
