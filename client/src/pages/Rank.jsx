import { useEffect, useState } from "react";

export default function Rank() {
    const [catsList, setCats] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/categoryList")
            .then((res) => res.json())
            .then((data) => {
                setCats(data);
            })
            .catch((err) =>
                setError({
                    error: true,
                    message: err.message,
                })
            );
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        if (categoryId) {
            fetch(`http://localhost:8080/score/${categoryId}`)
                .then((res) => res.json())
                .then((data) => {
                    setScores(data.scores);
                })
                .catch((err) =>
                    setError({
                        error: true,
                        message: err.message,
                    })
                );
        }
    };

    if (!scores) {
        return (
            <>
                <h1>Rankings</h1>
                {error && <p>Error: {error.message}</p>}
                <label htmlFor="categorySelect">Select Category:</label>
                <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">--Select Category--</option>
                    {catsList.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <h1>No data found</h1>
            </>
        )
    }

    return (
        <div>
            <h1>Rankings</h1>
            {error && <p>Error: {error.message}</p>}
            <label htmlFor="categorySelect">Select Category:</label>
            <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">--Select Category--</option>
                {catsList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {scores.length > 0 && (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>User Name</th>
                            <th style={thStyle}>Correct Answer Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td style={tdStyle}>{score.name}</td>
                                <td style={tdStyle}>{((score.totalQuestions * score.totalCorrectAnswers) / 100)*100}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
};

const thStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};
