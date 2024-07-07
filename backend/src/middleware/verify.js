import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided!" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Malformed token!" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token!" });
    req.user = decoded.username;
    next();
  });
};
