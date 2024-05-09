import React from 'react';

const ForecastMethodology = ({ label, onSelect, selectedMethodology }) => {
  return (
    <div className="input-group">
        <label className="label">{label}:</label>
        <select value={selectedMethodology} onChange={e => onSelect(e.target.value)}>
            <option value="">Select forecast methodology</option>
            {/* <option value="linear">Linear Regression</option> */}
            <option value="polynomial_2">Quadratic Polynomial Regression</option>
            <option value="random">Random Selection</option>
        </select>
    </div>
  );
};

export default ForecastMethodology;
