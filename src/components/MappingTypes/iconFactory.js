import GroupIcon from "../../assets/GroupIcon.png";
import ProfileIcon from "../../assets/ProfileIcon.webp";

export const iconType = (type) => {
  const iconMap = {
    SELF: ProfileIcon,
    GROUP: GroupIcon,
    DIRECT: ProfileIcon,
  };

  return iconMap[type] || ProfileIcon;
};
