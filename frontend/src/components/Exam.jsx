import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Exam({ token }) {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (examId) {
      axios
        .get(`http://localhost:5000/api/exams/${examId}`, {
          headers: { Authorization: token },
        })
        .then((res) => setExam(res.data))
        .catch((err) => {
          console.log(
            "Error fetching exam data :",
            err.response || err.message
          );
        });
    } else {
      console.error("examId is undefined");
    }
  }, [examId, token]);

  const submitExam = () => {
    axios
      .post(
        "http://localhost:5000/api/submit-exam",
        { examId, answers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        alert(`Your score: ${res.data.score}`);
      });
  };

  return exam ? (
    <div className="max-w-md mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
      {exam.questions.map((q, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-2xl font-bold">{q.question}</h3>
          {q.options.map((option, i) => (
            <div key={i} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name={index}
                  onChange={() => {
                    const newAnswers = [...answers];
                    newAnswers[index] = i;
                    setAnswers(newAnswers);
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={submitExam}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit Exam
      </button>
    </div>
  ) : (
    <div className="max-w-md mx-auto p-4 mt-12">
      <p>Loading...</p>
    </div>
  );
}

export default Exam;
