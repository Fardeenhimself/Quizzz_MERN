import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const Sidebar = ({ children }) => {

  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/admin-check", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data.admin === 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const menuItems = [
    { path: "/dashboard/", icon: "fa-chart-line", label: "Dashboard" },
    ...(isAdmin ? [{ path: "/dashboard/add-quiz", icon: "fa-list", label: "Categories" }] : []),
    ...(isAdmin ? [{ path: "/dashboard/user-list", icon: "fa-users", label: "User List" }] : []),
    ...(isAdmin ? [{ path: "/dashboard/rank", icon: "fa-users", label: "Rank" }] : []),
    ...(!isAdmin ? [{ path: "/dashboard/scores", icon: "fa-trophy", label: "Scores" }] : []),
  ];

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <ul style={sidebarList}>
          {menuItems.map((item, index) => (
            <li key={index} style={sidebarItem}>
              <Link to={item.path} style={linkStyle}>
                <i className={`fa-solid ${item.icon}`} style={{ marginRight: "5px" }}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

// styles
const containerStyle = {
  display: "flex",
};

const sidebarStyle = {
  width: "250px",
  backgroundColor: "#282c34",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const sidebarList = {
  listStyleType: "none",
  padding: 0,
};

const sidebarItem = {
  padding: "10px",
  cursor: "pointer",
  marginBottom: "10px",
  backgroundColor: "#444",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
};

const linkStyle = {
  textDecoration: "none",
  color: "white",
  display: "flex",
  alignItems: "center",
  width: "100%", 
};

const contentStyle = {
  flex: 1, // This makes the content area take up the remaining space
  padding: "20px",
};

export default Sidebar;
