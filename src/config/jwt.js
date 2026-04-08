require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "344kkfkf444",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
};
