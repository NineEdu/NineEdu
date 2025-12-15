import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// get transactions (admin)
// route: GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // build filter
    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    // search logic
    if (search) {
      // search by transaction code
      const searchByCode = {
        transactionCode: { $regex: search, $options: "i" },
      };

      // search by user name
      const matchingUsers = await User.find({
        fullName: { $regex: search, $options: "i" },
      }).select("_id");

      const listUserIds = matchingUsers.map((u) => u._id);

      filter.$or = [searchByCode, { userId: { $in: listUserIds } }];
    }

    // pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // query db
    const totalDocs = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .populate("userId", "fullName avatar email")
      .populate("courseId", "title thumbnail price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // format data mapping
    const formattedData = transactions.map((tx) => ({
      _id: tx._id,
      transactionCode: tx.transactionCode,
      amount: tx.amount,
      status: tx.status,
      paymentMethod: tx.paymentMethod,
      createdAt: tx.createdAt,
      user: tx.userId,
      course: tx.courseId,
    }));

    res.json({
      data: formattedData,
      pagination: {
        totalDocs,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(totalDocs / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};

export { getTransactions };
