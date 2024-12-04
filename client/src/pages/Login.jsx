import { useState, useContext } from "react";
import Input from "./components/Input";
import Button from "./components/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../Provider/Context";

function Login() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");
  const [redirectToSignUp, setRedirectToSignUp] = useState(false);

  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const loginSub = async () => {
    if (email.length === 0) {
      setEmailErr("Email is required.");
      setSubmitted(false);
      return;
    } else {
      if (!emailPattern.test(email)) {
        setEmailErr("Email is not valid.");
        setEmail("");
        setSubmitted(false);
        return;
      }
    }

    if (password.length === 0) {
      setPasswordErr("Password is required.");
      setSubmitted(false);
      return;
    } else {
      if (!passwordPattern.test(password)) {
        setPasswordErr(
          "Your Password must be at least 8 characters long and include at least one number and one letter."
        );
        setPassword("");
        setSubmitted(false);
        return;
      }
    }

    if (submitted) return;

    setErr("");

    setSubmitted(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.msg);
      } else {
        login(true);
        navigate("/");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      setErr("An error occurred during submission.");
    } finally {
      setSubmitted(false);
    }
  };

  const data = [
    {
      type: "email",
      name: "email",
      placeholder: "Email",
      value: email,
      err: emailErr,
      id: "email",
      setter: setEmail,
      setErr: setEmailErr,
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
      value: password,
      err: passwordErr,
      id: "password",
      setter: setPassword,
      setErr: setPasswordErr,
    },
  ];

  const registerSub = () => {
    setRedirectToSignUp(true);
  };

  const buttonData = [
    {
      name: "Login",
      listener: loginSub,
    },
    {
      name: "Register",
      listener: registerSub,
    },
  ];

  if (redirectToSignUp) {
    return <Navigate to="/signup" />;
  }

  return (
    <div style={loginContainerStyle}>
      <h1 style={headingStyle}>Login</h1>
      <div style={formContainerStyle}>
        {data.map((item, index) => (
          <Input key={index} data={item} />
        ))}
        {buttonData.map((item, index) => (
          <Button key={index} data={item} />
        ))}
        {err && <p style={errorMessageStyle}>{err}</p>}
      </div>
    </div>
  );
}

// styles
const loginContainerStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
  margin: "auto",
  marginTop: "50px",
};

const headingStyle = {
  fontSize: "28px",
  marginBottom: "20px",
  color: "#282c34",
};

const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const errorMessageStyle = {
  color: "red",
  fontSize: "18px",
  marginTop: "10px",
  marginBottom: "10px",
};

export default Login;
