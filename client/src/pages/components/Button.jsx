function Button({ data }) {
  const { name, listener } = data;

  return (
    <button onClick={listener} style={buttonStyle}>
      {name}
    </button>
  );
}

// styles
const buttonStyle = {
  backgroundColor: "#282c34",
  color: "#fff",
  padding: "10px 20px",
  fontSize: "18px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s, box-shadow 0.3s",
};

export default Button;
