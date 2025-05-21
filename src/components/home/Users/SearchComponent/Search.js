import { useRef, useState } from "react";
import backSearchButton from "../../../../assets/backSearchButton.png";
import searchIcon from "../../../../assets/searchIcon.png";
import "./Search.css";

const Search = () => {
  const [focus, setFocus] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  const handleFocus = () => {
    setFocus(true);
  };

  const removeFocus = () => {
    setFocus(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
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

      <div className="search-icon" onClick={removeFocus}>
        {focus ? (
          <img
            className={`back-search-image rotate-in`}
            src={backSearchButton}
          />
        ) : (
          <img className={`search-image rotate-out`} src={searchIcon} />
        )}
      </div>
    </div>
  );
};

export default Search;
