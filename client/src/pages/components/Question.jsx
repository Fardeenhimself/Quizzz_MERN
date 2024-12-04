import { useEffect, useState } from "react";

function Question({ data, setter, selectedValue }) {
  const { question, options, _id } = data;
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    setShuffledOptions(shuffleArray([...options]));
  }, [options]);

  const handleOptionChange = (e) => {
    setter({ id: _id, answer: e.target.value });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div>
      <h3 style={questionStyle}>{question}</h3>
      <div style={optionsStyle}>
        {shuffledOptions.map((option, index) => (
          <label key={index} style={optionStyle}>
            <input
              type="radio"
              value={option}
              onChange={handleOptionChange}
              style={radioInput}
              checked={selectedValue === option}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

const questionStyle = {
  marginBottom: "20px",
};
const optionsStyle = {
  display: "flex",
  flexDirection: "column",
};
const optionStyle = {
  backgroundColor: "#f1f1f1",
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginBottom: "10px",
  padding: "10px",
  display: "flex",
  alignItems: "center",
};

const radioInput = {
  marginRight: "10px",
};

export default Question;
