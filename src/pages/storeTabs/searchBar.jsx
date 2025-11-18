import React from 'react';
import IconSearch from "@/assets/icon_search.svg";
import './searchbar.css';

export default function SearchBar({
  value,
  defaultValue = "",
  placeholder = "",
  onChange,
  onSubmit,
  className = "",
}) {
  const controlled = value !== undefined;
  const handleChange = (v) =>{
    if (onChange){
        onChange(v);
    }
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input");
    if (input && onSubmit){
        onSubmit(input.value);
    }
  };
    return (
    <form
      onSubmit={handleSubmit}
      className={`search-bar ${className}`}
    >
      <img src={IconSearch} alt="" className="search-bar-icon" />

      <input
        type="text"
        value={controlled ? value : undefined}
        defaultValue={controlled ? undefined : defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="search-bar-input"
      />
    </form>
  );
}