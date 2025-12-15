import admin from "../configs/firebase.js";
import generateToken from "../libs/generateToken.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

// register new user
// route: POST /api/auth/register
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // check if email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already used" });
  }

  // create new user
  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid data" });
  }
};

// login & get token
// route: POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email });

  // check password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// login/register with firebase
// route: POST /api/users/auth/firebase
const authWithFirebase = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("1. Backend received token:", !!token);

    if (!token) {
      return res.status(400).json({ message: "Missing Firebase Token" });
    }

    // verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture, email_verified } = decodedToken;
    console.log("2. Decode success:", email);

    if (!email_verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // update existing user
      user.fullName = name || user.fullName;
      user.avatar = picture || user.avatar;
      await user.save();
    } else {
      // create new user
      console.log("3. Creating new user...");
      user = await User.create({
        fullName: name || "User Firebase",
        email: email,
        password: uid, // temporary password
        role: "student",
        avatar: picture,
      });
    }

    console.log("4. DB save success:", user._id);

    // return system jwt
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Firebase Backend Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// get current user info
// route: GET /api/auth/me
const getMe = async (req, res) => {
  // debug logs
  console.log("🔹 getMe Controller Triggered");
  console.log("🔹 User from request:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user missing" });
  }

  const enrollments = await Enrollment.find({ userId: req.user._id }).select(
    "courseId"
  );

  const courseIds = enrollments.map((enroll) => enroll.courseId);

  const user = {
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
    enrolledCourses: courseIds,
  };

  res.status(200).json(user);
};

export { registerUser, loginUser, getMe, authWithFirebase };
