function Input({ data }) {
  const { type, name, id, placeholder, value, setter, err, setErr } = data;

  const setInput = (e) => {
    setter(e.target.value);
    setErr("");
  };

  return (
    <>
      <input
        style={inputStyle}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onInput={setInput}
        autoComplete="on"
      />
      {err && <p style={errorMessageStyle}> {err} </p>}
    </>
  );
}

// styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.3s, box-shadow 0.3s",
};

const errorMessageStyle = {
  color: "red",
  fontSize: "18px",
  marginTop: "10px",
  marginBottom: "10px",
};

export default Input;
