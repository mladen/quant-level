import React from 'react';

const DisplayFilter = ({ onSelect }) => {
    return (
        <div className="input-group">
            <label className="label">Display Filter:</label>
            <select onChange={e => onSelect(e.target.value)}>
                <option value="Show all">Show all</option>
                <option value="Show winners">Show winners</option>
                <option value="Show losers">Show losers</option>
            </select>
        </div>
    );
};

export default DisplayFilter;
