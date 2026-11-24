import { useState } from "react";

const EMPTY = { city: "", zipcode: "", minPrice: "", maxPrice: "", beds: "", baths: "" };

export default function PropertyFilters({ onSearch, onClear }) {
  const [values, setValues] = useState(EMPTY);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const filled = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v.trim() !== "")
    );
    onSearch(filled);
  };

  const handleClear = () => {
    setValues(EMPTY);
    onClear();
  };

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="city">City</label>
        <input id="city" name="city" value={values.city} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="zipcode">ZIP code</label>
        <input id="zipcode" name="zipcode" value={values.zipcode} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="minPrice">Min price</label>
        <input id="minPrice" name="minPrice" type="number" min="0" value={values.minPrice} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="maxPrice">Max price</label>
        <input id="maxPrice" name="maxPrice" type="number" min="0" value={values.maxPrice} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="beds">Beds</label>
        <select id="beds" name="beds" value={values.beds} onChange={handleChange}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="baths">Baths</label>
        <select id="baths" name="baths" value={values.baths} onChange={handleChange}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="actions">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>Clear Filters</button>
      </div>
    </form>
  );
}