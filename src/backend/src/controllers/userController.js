import User from "../models/User.js";

// get public user profile
// route: GET /api/users/public/:id
const getPublicUserProfile = async (req, res) => {
  try {
    // select only specific fields
    const user = await User.findById(req.params.id).select(
      "fullName avatar role createdAt bio"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// get all users (admin)
// route: GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const { keyword, role, page = 1, limit = 10 } = req.query;

    let filter = {};

    // search by name or email
    if (keyword) {
      filter.$or = [
        { fullName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // filter by role
    if (role && role !== "all") {
      filter.role = role;
    }

    // pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      users,
      pagination: {
        totalUsers,
        page: pageNumber,
        pages: Math.ceil(totalUsers / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user by id (admin)
// route: GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user (admin)
// route: PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent self-demotion
    if (
      user._id.toString() === req.user._id.toString() &&
      req.body.role &&
      req.body.role !== "admin"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot demote yourself from admin" });
    }

    // update fields
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;

    if (req.body.role) user.role = req.body.role;
    if (req.body.isBlocked !== undefined) user.isBlocked = req.body.isBlocked;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      isBlocked: updatedUser.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete user (admin)
// route: DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete logged-in account" });
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user profile
// route: PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.avatar = req.body.avatar || user.avatar;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        token: req.headers.authorization.split(" ")[1],
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// change password
// route: PUT /api/users/profile/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword; // model pre-save handles hash
      await user.save();
      res.json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getPublicUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  changePassword,
};
