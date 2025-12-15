import moment from "moment";
import qs from "qs";
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// create payment url
export const createPaymentUrl = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user._id;

    // config env
    const vnp_TmnCode = process.env.VNP_TMN_CODE;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const vnp_Url = process.env.VNP_URL;
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("DDHHmmss");

    // order content: Pay_Course_{courseId}_User_{userId}
    const orderInfo = `Pay_Course_${courseId}_User_${userId}`;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const vnp_ReturnUrl = `${frontendUrl}/courses/${courseId}/payment-result`;

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // vnpay requires amount * 100
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac
      .update(new Buffer.from(signData, "utf-8"))
      .digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    const paymentUrl =
      vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// handle vnpay return (save transaction & enrollment)
export const vnpayReturn = async (req, res) => {
  try {
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    // remove hash for signature check
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac
      .update(new Buffer.from(signData, "utf-8"))
      .digest("hex");

    // check signature validity
    if (secureHash === signed) {
      const orderInfo = vnp_Params["vnp_OrderInfo"];
      const parts = orderInfo.split("_");
      const courseId = parts[2];
      const userId = parts[4];
      const amount = vnp_Params["vnp_Amount"] / 100; // revert amount
      const transactionNo = vnp_Params["vnp_TransactionNo"];
      const bankCode = vnp_Params["vnp_BankCode"];
      const responseCode = vnp_Params["vnp_ResponseCode"];

      // check idempotency (avoid duplicate transactions)
      let transaction = await Transaction.findOne({
        transactionCode: transactionNo,
      });

      if (!transaction) {
        // create new transaction
        transaction = await Transaction.create({
          userId,
          courseId,
          amount,
          paymentMethod: "VNPAY",
          transactionCode: transactionNo,
          bankCode: bankCode,
          status: responseCode === "00" ? "success" : "failed",
          message:
            responseCode === "00"
              ? "Transaction successful"
              : "Transaction failed",
        });
      }

      // handle transaction result
      if (responseCode === "00") {
        // success case

        // 1. create enrollment if not exists
        const existingEnrollment = await Enrollment.findOne({
          userId,
          courseId,
        });
        if (!existingEnrollment) {
          await Enrollment.create({
            userId,
            courseId,
            status: "in-progress",
            progress: 0,
          });

          // 2. update user enrolled courses
          await User.findByIdAndUpdate(userId, {
            $addToSet: { enrolledCourses: courseId },
          });
        }

        return res.json({
          status: "success",
          code: "00",
          message: "Payment successful, course activated",
          data: { courseId },
        });
      } else {
        // failure case
        return res.json({
          status: "error",
          code: responseCode,
          message: "Transaction failed or cancelled",
        });
      }
    } else {
      // invalid signature
      return res.json({
        status: "error",
        code: "97",
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("VNPAY Return Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// sort object helper (required by vnpay)
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
