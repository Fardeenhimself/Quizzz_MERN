
function Card({ cat, action}) {
  const { _id, name, icon, description } = cat;
  
  return (
    <div onClick={action}
      style={cardStyle}
    >
      {/* <i className={icon} style={iconStyle}></i> */}
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
}

// styles
const cardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "150px",
  textAlign: "left",
  cursor: "pointer",
};


const iconStyle = {
  marginRight: "10px",
  color: "#282c34",
  fontSize: "28px",
};

export default Card;
