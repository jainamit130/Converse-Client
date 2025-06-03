import { useEffect, useState } from "react";
import useGetUsers from "./../hook/useGetUsers";

const useSearchableUsers = (excludeUserIds = []) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getUsers } = useGetUsers();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetched = await getUsers();
        const currentUsername = localStorage.getItem("username");

        const processedUsers = (fetched || []).map((user) => {
          if (user.username === currentUsername) {
            return {
              ...user,
              username: `${user.username} (You)`,
            };
          }
          return user;
        });

        setUsers(processedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !excludeUserIds.includes(user.userId)
  );

  return { searchTerm, setSearchTerm, filteredUsers };
};

export default useSearchableUsers;
