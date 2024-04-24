import React from 'react';

const InvestmentInput = ({ label, value, onInvestmentChange, min, max }) => {
  return (
    <div className="input-group">
      <label className="label">{label}:</label>
      <input 
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onInvestmentChange(e.target.value)}
        placeholder="Enter overall investment budget"
      />
    </div>
  );
};

export default InvestmentInput;
