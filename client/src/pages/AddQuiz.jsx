import { useEffect, useState } from "react";
import Card from "./components/Card";
import { useNavigate } from "react-router-dom";

function AddQuiz() {
  const [catsList, setCats] = useState([]);
  const [catsErr, setCatsErr] = useState({
    error: false,
    message: "",
  });

  function delFun(id){
    const modCats = catsList.filter((cat) => cat._id !== id);

    setCats(modCats);

    fetch('http://localhost:8080/delFetch/' + id)
    .then(response => response.json())
    .then(data => {
      alert(data.msg)
    })
  }

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/categoryList")
      .then((res) => res.json())
      .then((data) => {
        setCats(data);
      })
      .catch((err) =>
        setCatsErr({
          error: true,
          message: err.message,
        })
      );
  }, []);


  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Categories</h1>
      {catsErr.error && <p style={{ color: "red" }}>{catsErr.message}</p>}
      <div style={cardContainerStyle}>
        {catsList.map((cat) => (
          <>
            <Card key={cat._id} cat={cat} url={"/dashboard/add-question/"} />
            <button style={btnStyle}
              onClick={() => {
                delFun(cat._id);
              }}
            >
              <i className={"fa-regular fa-trash-can"} style={iconStyle}></i>
            </button>
          </>
        ))}
      </div>
      <div>
        <button
          style={addButton}
          onClick={() => navigate("/dashboard/category-add")}
        >
          Add Category
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };
  
  const headingStyle = {
    fontSize: "24px",
    marginBottom: "10px",
  };
  
  const cardContainerStyle = {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };
  const addButton = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    marginLeft: "5px"
  };
  const btnStyle = {
    border: "none",
    backgroundColor: "#f4f4f4",
  };
  const iconStyle = {
    marginRight: "10px",
    color: "#282c34",
    fontSize: "28px",
    cursor: "pointer",
  };
  
  

export default AddQuiz;
