import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postSkillAssessment,
  resetSkillAssessmentSlice,
} from "@/store/slices/skillAssessmentsSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const RegisterSkillAssessment = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(
    (state) => state.skillAssessments
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [passingScore, setPassingScore] = useState(50);
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ text: "", isCorrect: false }] },
  ]);

  useEffect(() => {
    // Cleanup function to reset state when leaving component
    return () => {
      dispatch(resetSkillAssessmentSlice());
    };
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      resetForm();
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration(30);
    setPassingScore(50);
    setQuestions([
      { questionText: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleCorrectOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === oIndex;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !questions.length || !duration || !passingScore) {
      toast.error("Please fill all required fields");
      return;
    }

    for (const q of questions) {
      if (!q.questionText.trim()) {
        toast.error("Each question must have text");
        return;
      }
      if (q.options.length < 2) {
        toast.error("Each question must have at least two options");
        return;
      }
      if (!q.options.some((opt) => opt.isCorrect)) {
        toast.error("Each question must have at least one correct answer");
        return;
      }
    }

    dispatch(
      postSkillAssessment({
        title,
        description,
        duration: Number(duration),
        passingScore: Number(passingScore),
        questions,
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Register Skill Assessment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        ></textarea>
        <input
          type="number"
          placeholder="Duration (mins)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Passing Score"
          value={passingScore}
          onChange={(e) => setPassingScore(e.target.value)}
          required
          className="w-full p-2 border rounded mb-2"
        />
        <h3 className="font-semibold mb-2">Questions</h3>
        {questions.map((q, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 border p-3 rounded"
          >
            <input
              type="text"
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Option text"
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectOption(qIndex, oIndex)}
                  className="ml-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(qIndex)}
              className="text-blue-600"
            >
              + Add Option
            </button>
          </motion.div>
        ))}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleAddQuestion}
          className="block w-full bg-gray-200 text-gray-700 p-2 rounded mb-2"
        >
          + Add Question
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default RegisterSkillAssessment;
