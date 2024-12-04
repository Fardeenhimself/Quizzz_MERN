const DashboardCard = ({ title, count, icon, onAdd, onView }) => {
    return (
      <div style={cardStyle}>
        <i className={`fa-solid ${icon}`} style={iconStyle}></i>
        <div style={textContainerStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <p style={countStyle}>{count}</p>
        </div>
      </div>
    );
  };
  
  // styles
  const cardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '150px', 
    height: '150px', 
  };
  
  const iconStyle = {
    fontSize: '32px', 
    color: '#007bff',
    marginRight: '15px',
  };
  
  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  };
  
  const titleStyle = {
    margin: 0,
    fontSize: '18px', // Adjusted font size
    color: '#6c757d',
  };
  
  const countStyle = {
    fontSize: '28px', // Adjusted font size
    margin: '10px 0', // Adjusted margin
    fontWeight: 'bold',
  };

  
  export default DashboardCard;
  