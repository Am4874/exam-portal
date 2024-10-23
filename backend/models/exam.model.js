const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true, unique: true }],
  correctOptionIndex: { type: Number, required: true, min: 0 },
});

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
});

const Exam = mongoose.model("Exam", ExamSchema);

module.exports = Exam;

async function seedDatabase() {
  try {
    const sampleExam = new Exam({
      title: "Sample Exam",
      questions: [
        {
          question: "What is 2 + 2?",
          options: ["1", "2", "3", "4"],
          correctOptionIndex: 3,
        },
        {
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          correctOptionIndex: 2,
        },
      ],
    });
    await sampleExam.save();
    console.log("Exam seeded");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// seedDatabase();
