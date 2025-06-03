import React from "react";
import Tile from "../../../reusableComponents/Tile/Tile";
import { iconType } from "../../../MappingTypes/iconFactory";

const UserTileList = ({ users, userId, onTileClick, onGroupTagClick }) => {
  return users.length > 0 ? (
    users.map((user) => (
      <div key={user.userId} onClick={() => onGroupTagClick(user)}>
        <Tile
          key={user.userId}
          id={user.userId}
          name={user.username}
          type={user.userId === userId ? "SELF" : "DIRECT"}
          icon={iconType("DIRECT")}
          tileClick={onTileClick}
        />
      </div>
    ))
  ) : (
    <p style={{ padding: "0 20px", color: "gray" }}>No matching users found</p>
  );
};

export default UserTileList;
