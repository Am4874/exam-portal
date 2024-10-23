import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Examlist({ token }) {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exams", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setExams(res.data);
      });
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-4">Exams</h1>
      <ul>
        {exams.map((exam) => (
          <li key={exam._id} className="mb-4">
            <h2 className="text-2xl font-bold">{exam.title}</h2>
            <Link
              to={`/exam/${exam._id}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Take Exam
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Examlist;