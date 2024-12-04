import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

function LoginContext({ children }) {
  const [user, setUser] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/session", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser(true);
        } else {
          setUser(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        setUser(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}

export default LoginContext;
