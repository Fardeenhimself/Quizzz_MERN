import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate, useParams } from "react-router-dom";

const AddQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    level: "",
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/quizs/${id}`)
      .then((res) => res.json())
      .then((data) => {

        setQuestions(data);
        if (data.length === 0) {
          alert("No questions available.");
        }
      });
  }, [id]);

  const openAddModal = () => {
    setCurrentQuestion({ level: "", question: "", options: ["", "", "", ""], answer: "" });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (question, index) => {
    setCurrentQuestion(question);
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (question) => {
    setCurrentQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion((prevState) => ({
        ...prevState,
        options: newOptions,
      }));
    } else {
      setCurrentQuestion((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryId = id;

    if (isEditModalOpen) {
      fetch(`http://localhost:8080/editQuestion/${currentQuestion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentQuestion),
      })
        .then((res) => res.json())
        .then(() => {
          setQuestions((prevState) =>
            prevState.map((q, index) =>
              index === editingIndex ? currentQuestion : q
            )
          );
          closeEditModal();
        });
    } else {
      fetch(`http://localhost:8080/quiz/${categoryId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentQuestion),
      })
        .then((res) => res.json())
        .then((newQuestionId) => {

          setQuestions((prevState) => [
            ...prevState,
            { ...currentQuestion, _id: newQuestionId }
          ]);
          closeAddModal();
        })
        .catch((error) => {
          console.error('Error adding question:', error);
        });

    }
  };


  const handleDelete = () => {
    if (questions.length === 0) {
      alert("No questions available to delete.");
      return;
    }

    fetch(`http://localhost:8080/deleteQuestion/${currentQuestion._id}`, {
      method: "DELETE",
    })
      .then(() => {
        setQuestions(questions.filter((q) => q._id !== currentQuestion._id));
        closeDeleteModal();
      });
  };

  return (
    <div style={quizContainer}>
      <div style={quizHeader}>
        <h2 style={headerTitle}>Manager Quiz</h2>
        <p>Total Questions: {questions.length}</p>
      </div>
      <div style={quizContent}>
        {questions.map((question, index) => (
          <div key={question._id} style={questionContainer}>
            <h3>
              {index + 1}. {question.question} ({question.level} level){" "}
              <button
                style={iconButton}
                onClick={() => openEditModal(question, index)}
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>{" "}
              <button
                style={iconButton}
                onClick={() => openDeleteModal(question)}
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </h3>
            <ul>
              {question.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
            <h5>Ans: {question.answer}</h5>
          </div>
        ))}
      </div>
      <div>
        <button style={addButton} onClick={() => navigate("/dashboard/add-quiz")}>
          Back
        </button>
        <button style={addButton} onClick={openAddModal}>
          Add Quiz
        </button>
      </div>

      {/* Add/Edit Quiz Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>{isEditModalOpen ? "Edit Quiz" : "Add Quiz"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={formGroup}>
                <label style={formLabel}>Level:</label>
                <select style={formInput} value={currentQuestion.level} name="level" onChange={handleInputChange}>
                  <option>Select a level</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <label style={formLabel}>Question:</label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleInputChange}
                  style={formInput}
                  required
                />
              </div>
              <div style={formGroup}>
                <label style={formLabel}>Options:</label>
                {currentQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleInputChange(e, index)}
                    style={formInput}
                    required
                  />
                ))}
              </div>
              <div style={formGroup}>
                <label style={formLabel}>Answer:</label>
                <input
                  type="text"
                  name="answer"
                  value={currentQuestion.answer}
                  onChange={handleInputChange}
                  style={formInput}
                  required
                />
              </div>
              <button
                type="button"
                style={modalButton}
                onClick={isEditModalOpen ? closeEditModal : closeAddModal}
              >
                Close
              </button>
              <button type="submit" style={modalButton}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this question?</p>
            <button style={modalButton} onClick={closeDeleteModal}>
              Cancel
            </button>
            <button style={modalButton} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const quizContainer = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "400px",
  padding: "20px",
  margin: "auto",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const quizHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const headerTitle = {
  margin: 0,
  color: "#007bff",
};

const quizContent = {
  textAlign: "left",
};

const questionContainer = {
  marginBottom: "20px",
};

const iconButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
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

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
};

const formGroup = {
  marginBottom: "15px",
};

const formLabel = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
};

const formInput = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const modalButton = {
  margin: "10px",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
};

export default AddQuestion;
