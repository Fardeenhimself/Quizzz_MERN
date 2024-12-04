import "@fortawesome/fontawesome-free/css/all.min.css";
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../Provider/Context";

const Header = () => {
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);


  const handleLoginClick = () => {
    if (location.pathname.split("/")[1] === "quiz") {
      confirmFinish();
    } else {
      if (user) {
        fetch("http://localhost:8080/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              login(false);
              navigate("/login");
            } else {
              console.log("Logout failed");
            }
          })
          .catch(() => {
            console.log("Logout failed");
          });
      } else {
        navigate("/login");
      }
    }
  };
  

  const confirmFinish = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDashboard = () => {
    if (location.pathname.split("/")[1] === "quiz") {
      confirmFinish();
    } else {
      navigate("/dashboard/");
    }
  };

  const open = () => {
    if (location.pathname.split("/")[1] === "quiz") {
      confirmFinish();
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header style={navbarStyle}>
        <div style={titleContainerStyle}>
          <h1 style={titleStyle} onClick={open}>
            QUIZZZZZ
          </h1>
          <i
            className="fa-solid fa-dice-d20"
            style={{
              paddingLeft: "5px",
              marginRight: "10px",
              fontSize: "24px",
              color: "white",
            }}
          ></i>
        </div>
        {user && (
          <button
            style={profileButtonStyle}
            title="Dashboard"
            aria-label="Dashboard"
            onClick={handleDashboard}
          >
            <i className="fa-solid fa-user"></i>
          </button>
        )}
        <button
          style={loginButtonStyle}
          title={user ? "Logout" : "Login"}
          aria-label={user ? "Logout" : "Login"}
          onClick={handleLoginClick}
        >
          {user ? (
            <i className="fa-solid fa-sign-out-alt"></i>
          ) : (
            <i className="fa-solid fa-sign-in-alt"></i>
          )}
        </button>
      </header>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContainer}>
            <h2>Please finish the quiz.</h2>
            <div style={modalFooter}>
              <button onClick={closeModal} style={buttonCancel}>
                Ok !
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// styles
const navbarStyle = {
  backgroundColor: "#282c34",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "60px",
};

const buttonCancel = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContainer = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const modalFooter = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const titleContainerStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle = {
  color: "white",
  fontSize: "24px",
  textAlign: "center",
  margin: 0,
  cursor: "pointer",
};

const loginButtonStyle = {
  background: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  border: "2px solid #ffff",
  padding: "10px",
  borderRadius: "5px",
};

const profileButtonStyle = {
  ...loginButtonStyle,
  marginRight: "5px",
};

export default Header;
