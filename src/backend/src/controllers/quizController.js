import Quiz from "../models/Quiz.js";
import Enrollment from "../models/Enrollment.js";

// create quiz
// route: POST /api/quizzes
const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get quiz by lesson id
// route: GET /api/quizzes/:lessonId
const getQuizByLesson = async (req, res) => {
  try {
    // exclude correct answers for students
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId }).select(
      "-questions.correctAnswer -questions.explanation"
    );

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found for this lesson" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// submit quiz & grade
// route: POST /api/quizzes/submit
const submitQuiz = async (req, res) => {
  try {
    // get input
    const { quizId, answers } = req.body;
    const userId = req.user._id;

    console.log("Submit Quiz:", {
      userId,
      quizId,
      answersCount: answers?.length,
    });

    // fetch full quiz with answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // validate input length
    if (!answers || answers.length !== quiz.questions.length) {
      return res.status(400).json({
        message: "Answer count mismatch.",
      });
    }

    // grading logic
    let correctCount = 0;

    const resultDetails = quiz.questions.map((question, index) => {
      const submittedAnswer = answers[index];
      const isCorrect = submittedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: question._id,
        isCorrect,
        userAnswer: submittedAnswer,
        correctAnswer: question.correctAnswer, // return correct answer for review
        explanation: question.explanation,
      };
    });

    // calc result
    const totalQuestions = quiz.questions.length;
    const isPassed = correctCount >= quiz.passingScore;

    console.log(
      `Result: ${correctCount}/${totalQuestions} - Passed: ${isPassed}`
    );

    // save result to enrollment
    if (quiz.courseId) {
      const enrollment = await Enrollment.findOne({
        userId,
        courseId: quiz.courseId,
      });

      if (enrollment) {
        const resultData = {
          quizId: quiz._id,
          score: correctCount,
          total: totalQuestions,
          passed: isPassed,
          attemptedAt: new Date(),
        };

        // check previous attempts
        const existingResultIndex = enrollment.quizResults.findIndex(
          (q) => q.quizId.toString() === quizId
        );

        if (existingResultIndex > -1) {
          // update existing result
          enrollment.quizResults[existingResultIndex] = resultData;
        } else {
          // add new result
          enrollment.quizResults.push(resultData);
        }

        await enrollment.save();
      } else {
        console.warn("User not enrolled in course");
      }
    }

    // return result
    res.json({
      score: correctCount,
      total: totalQuestions,
      passed: isPassed,
      passingScore: quiz.passingScore,
      details: resultDetails,
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// update quiz
// route: PUT /api/quizzes/:id
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete quiz
// route: DELETE /api/quizzes/:id
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get quiz details (for editing)
// route: GET /api/quizzes/details/:id
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createQuiz,
  getQuizByLesson,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
};
