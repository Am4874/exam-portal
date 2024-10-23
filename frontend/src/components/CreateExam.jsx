import React, { useState } from "react";
import axios from "axios";

function CreateExam({ token }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", ""], correctOption: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], correctOption: 0 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "question") {
      newQuestions[index].question = value;
    } else if (field === "correctOption") {
      const correctOption = Number(value);
      if (
        correctOption >= 0 &&
        correctOption < newQuestions[index].options.length
      ) {
        newQuestions[index].correctOption = correctOption;
      }
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    if (value !== "") {
      newQuestions[qIndex].options[optIndex] = value;
      setQuestions(newQuestions);
    }
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length < 5) {
      newQuestions[qIndex].options.push("");
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        "http://localhost:5000/api/exams",
        { title, questions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        alert("Exam created successfully");
        setTitle("");
        setQuestions([{ question: "", options: ["", ""], correctOption: 0 }]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error creating exam:", err);
        setLoading(false);
      });
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl text-center mb-5">Create New Exam</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Question {qIndex + 1}
            </label>
            <input
              type="text"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question", e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />

            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="mb-2">
                <label className="block text-gray-600">
                  Option {optIndex + 1}
                </label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, optIndex, e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
            >
              Add Option
            </button>

            <div className="mt-2">
              <label className="block text-gray-700">Correct Option</label>
              <input
                type="number"
                value={q.correctOption}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correctOption", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                max="4"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit Exam"}
        </button>
      </form>
    </div>
  );
}

export default CreateExam;
