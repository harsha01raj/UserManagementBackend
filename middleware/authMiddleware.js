const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(404).json({ Message: "Token not found..." });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(400).json({ Message: "Invalid Token" });
      }
      console.log(decode);
      req.user = decode;
      next();
    });
  } catch (error) {
    res.status(400).json({ Error: error.messsage });
  }
};

module.exports = auth;
