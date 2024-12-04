import { Link } from "react-router-dom";
const UserTable = ({ users }) => {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={styles.tableRow}>
              <td style={styles.tableCell}>{user._id}</td>
              <td style={styles.tableCell}>{user.name}</td>
              <td style={styles.tableCell}>{user.email}</td>
              <td style={styles.tableCell}>{user.role}</td>
              <td style={styles.tableCell}>
                {/* <button 
                  onClick={() => onEdit(user._id)} 
                  style={{ ...styles.button, backgroundColor: "#007bff" }}>
                  Performance
                </button> */}
                {user.role !== 'admin' &&
                <Link
                  to={`/dashboard/user-list/Performance/${user._id}`}
                  style={{ ...styles.button, backgroundColor: "#007bff" }}
                >
                  Performance
                </Link>}
                {/* <button 
                  onClick={() => onBlock(user._id)} 
                  style={{ ...styles.button, backgroundColor: "#007bff"}}>
                  Block
                </button>
                <button 
                  onClick={() => onDelete(user._id)} 
                  style={{ ...styles.button, backgroundColor: "#dc3545" }}>
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    maxWidth: "800px",
    margin: "20px auto",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#282c34",
    color: "#fff",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "8px",
    textAlign: "left",
  },
  button: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
    color: "white",
  },
};

export default UserTable;
