import { useState } from "react";
import Input from "./components/Input";
import Button from "./components/Button";
import { Navigate, useNavigate } from 'react-router-dom';

function SignUp() {
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passwordCon, setPasswordCon] = useState("");
  const [passwordErrCon, setPasswordErrCon] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [err, setErr] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false)

  const navigate = useNavigate();

  const namePattern = /^[A-Z][a-zA-Z'-]*\s?[A-Z]?[a-zA-Z'-]*$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const signUpSub = async () => {
    if (name.length === 0) {
      setNameErr("Name is required!");
      setSubmitted(false);
      return;
    } else {
      if (!namePattern.test(name)) {
        setNameErr("Invalid name!");
        setName("");
        setSubmitted(false);
        return;
      }
    }

    if (email.length === 0) {
      setEmailErr("Email is required!");
      setSubmitted(false);
      return;
    } else {
      if (!emailPattern.test(email)) {
        setEmailErr("Email is not valid!");
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

    if (password != passwordCon) {
      setPasswordErrCon("Not Match");
      setPasswordCon("");
      setSubmitted(false);
      return;
    }

    if (submitted) return;

    setErr("");

    setSubmitted(true);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.msg);
      } else {
        alert(data.msg);
        navigate("/login")
      }
      setName("");
      setEmail("");
      setPassword("");
      setPasswordCon("");
    } catch (error) {
      setErr("An error occured");
    } finally {
      setSubmitted(false);
    }
  };

  const loginSub = () => {
    setRedirectToLogin(true)
  };

  const data = [
    {
      type: "text",
      name: "name",
      placeholder: "Enter Your Name",
      value: name,
      err: nameErr,
      id: "name",
      setter: setName,
      setErr: setNameErr,
    },

    {
      type: "email",
      name: "email",
      placeholder: "Enter a valid Email",
      value: email,
      err: emailErr,
      id: "email",
      setter: setEmail,
      setErr: setEmailErr,
    },

    {
      type: "password",
      name: "password",
      placeholder: "Create a password",
      value: password,
      err: passwordErr,
      id: "password",
      setter: setPassword,
      setErr: setPasswordErr,
    },
    {
      type: "password",
      name: "Confirm password",
      placeholder: "Confirm password",
      value: passwordCon,
      err: passwordErrCon,
      id: "passwordCon",
      setter: setPasswordCon,
      setErr: setPasswordErrCon,
    },
  ];

  const buttonData = [
    {
      name: "Sign Up",
      listener: signUpSub,
    },
    {
      name: "Login",
      listener: loginSub,
    },
  ];


  if(redirectToLogin){
    return <Navigate to="/login" />
  }

  return (
    <div style={SignUpContainerStyle}>
      <h1 style={headingStyle}>SignUp</h1>
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

const SignUpContainerStyle = {
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

export default SignUp;
