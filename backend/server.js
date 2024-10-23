const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { authMiddleware } = require("./middleware/auth.js");
const Exam = require("./models/exam.model.js");
const User = require("./models/user.model.js");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(`mongodb+srv://Amit:eKlGzZ9GJtYOlVCJ@cluster0.uquvk.mongodb.net/`)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(`Error : ${err}`));

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please provide all required fields");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).send("User registered successfully!");
  } catch (err) {
    res.status(500).send("Error registering user");
  }
});

// login

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please provide all required fields");
  }

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id },
    process.env.SECRET_KEY || "secret-key"
  );

  res.header("Authorization", token).send({ token });
});

// exams API requests
app.get("/api/exams", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).send("Error fetching exams");
  }
});

// For Dynamic exam
app.get("/api/exams/:examId", async (req, res) => {
  const { examId } = req.params;
  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).send("Exam not found");
    res.json(exam);
  } catch (err) {
    res.status(500).send("Error fetching exam");
  }
});

// Submite questions and get score
app.post("/api/submit-exam", async (req, res) => {
  const { examId, answers } = req.body;

  if (!examId || !answers) {
    return res.status(400).send("Please provide all required fields");
  }

  try {
    const exam = await Exam.findById(examId);

    if (!exam) return res.status(404).send("Exam not found");

    let score = 0;

    exam.questions.forEach((q, index) => {
      if (q.correctOption === answers[index]) {
        score += 1;
      }
    });

    res.json({ score });
  } catch (err) {
    res.status(500).send("Error submitting exam");
  }
});

// for admin to add questions and answers
app.post("/api/exams", async (req, res) => {
  const { title, questions } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res.status(400).send("Please provide the title and questions");
  }

  try {
    const newExam = new Exam({
      title,
      questions,
    });

    await newExam.save();
    res.status(201).send("Exam created successfully");
  } catch (err) {
    res.status(500).send("Error creating exam");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
