import { useRef, useState } from "react";
import backSearchButton from "../../../../assets/backSearchButton.png";
import searchIcon from "../../../../assets/searchIcon.png";
import "./Search.css";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setFocus(true);
    inputRef.current?.focus();
  };

  const removeFocus = () => {
    setFocus(false);
    inputRef.current?.blur();
  };

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        className="searchUsers"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocus(false)}
        placeholder="Search users"
      />

      <div className="search-icon">
        {focus ? (
          <img
            className={`back-search-image rotate-in`}
            src={backSearchButton}
            onClick={removeFocus}
          />
        ) : (
          <img
            className={`search-image rotate-out`}
            src={searchIcon}
            onClick={handleFocus}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
