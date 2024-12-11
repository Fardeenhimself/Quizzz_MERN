import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={bioStyle}>
        <p>All Rights Reserved</p>
      </div>
      <div style={socialIconsStyle}>
        <a
          href="https://github.com"
          style={iconStyle}
          title="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github"></i>
        </a>
        <a
          href="https://discord.com"
          style={iconStyle}
          title="Discord"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-discord"></i>
        </a>
        <a
          href="https://linkedin.com"
          style={iconStyle}
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
      <div style={copyrightStyle}>
        <p>&copy; Fardeen Been Zaman & Mazharul Islam </p>
      </div>
    </footer>
  );
};

// styles
const footerStyle = {
  backgroundColor: "#282c34",
  color: "#fff",
  textAlign: "center",
  padding: "20px",
  marginTop: "20px",
};

const socialIconsStyle = {
  margin: "10px 0",
  fontSize: "24px",
};

const iconStyle = {
  margin: "0 10px",
  color: "#fff",
  textDecoration: "none",
};

const bioStyle = {
  margin: "10px 0",
  fontSize: "18px",
};

const copyrightStyle = {
  margin: "10px 0",
  fontSize: "18px",
};

export default Footer;
