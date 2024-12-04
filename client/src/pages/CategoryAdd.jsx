import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryAdd = () => {
  const [icons, setIcons] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectLevel, setSelectLevel] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch("http://localhost:8080/catIcons");
        const data = await response.json();
        setIcons(data);
      } catch (error) {
        console.error("Error fetching icons:", error);
      }
    };

    fetchIcons();
  }, []);
  const handleAddCategory = async () => {
    if (!name) {
      alert("Please enter a name and select an icon.");
      return;
    }

    const categoryData = { name, description,  level: selectLevel };

    try {
      const response = await fetch("http://localhost:8080/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Category added:", result);

      alert("Category successfully added!");

      setName("");
      setDescription("");
      selectLevel("");

    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Add Category</h1>
      <div style={formContainerStyle}>
        <input
          type="text"
          placeholder="Category Name"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Category Description"
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          id="level"
          style={selectStyle}
          value={selectLevel}
          onChange={(e) => setSelectLevel(e.target.value)}
        >
          <option>
            Select a level.
          </option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button onClick={handleAddCategory} style={addButtonStyle}>
          Add
        </button>
        <button style={addButtonStyle} onClick={() => { navigate("/dashboard/add-quiz") }}>
          Back
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const headerStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px",
};

const inputStyle = {
  margin: "10px 0",
  width: "300px",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const selectStyle = {
  margin: "10px 0",
  width: "300px",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#282c34",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "5px",
};

const textareaStyle = {
  resize: "none",
  margin: "10px 0",
  width: "300px",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  height: "100px"
}

export default CategoryAdd;
