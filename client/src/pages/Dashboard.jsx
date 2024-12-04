import { useState, useEffect } from "react";
import DashboardCard from "./components/DashboardCard";
import { Link } from "react-router-dom";
import CategoryPieChart from "./components/CategoryPieChart";

const Dashboard = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [userID, setUserID] = useState('');
  const [stats, setStats] = useState({
    categories: 0,
    users: 0,
    questions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/dashboard/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats({
          categories: data.categories,
          users: data.users,
          questions: data.questions,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to fetch dashboard statistics");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/admin-check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data.admin === 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        if (id) {
          setUserID(id);
        }
      } catch (err) {
        console.error("Failed to fetch user ID:", err);
        setError("Failed to fetch user ID");
      }
    };
    
    if (!isAdmin) {
      fetchUserId();
    }
  }, [isAdmin]);
  
  const getUserId = async () => {
    const response = await fetch("http://localhost:8080/emailBysession", {
      method: "GET",
      credentials: "include",
    }); 
    const data = await response.json();
    return data.userId;
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div style={dashboardStyle}>
      <h1 style={headerStyle}>Dashboard</h1>
      <div>
        {!isAdmin && <CategoryPieChart userId={userID}/>}
      </div>
      <div style={cardsContainerStyle}>
        {isAdmin && (
          <>
            <DashboardCard
              title="Categories"
              count={stats.categories}
              icon="fa-folder"
            />
            <DashboardCard title="Users" count={stats.users} icon="fa-users" />
            <DashboardCard
              title="Questions"
              count={stats.questions}
              icon="fa-question"
            />
          </>
        )}
      </div>
      {isAdmin && (
        <div style={buttonsContainerStyle}>
          <Link to="/dashboard/category-add" style={buttonStyle}>
            Add Category
          </Link>
          <Link to="/dashboard/user-list" style={buttonStyle}>
            User List
          </Link>
        </div>
      )}
    </div>
  );
};

// styles
const dashboardStyle = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const cardsContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "20px",
};

const buttonsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "10px 20px",
  textDecoration: "none",
  fontSize: "16px",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export default Dashboard;
