import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const createNewUser = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ msg: "Username already in use." });
    }

    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Username and Password are required." });
    }

    if (username.length < 3 || password.length < 8) {
      return res.status(400).json({
        msg: "Username must be 3 or more chars and Password must be 8 or more.",
      });
    }

    if (confirmPassword !== password) {
      return res
        .status(400)
        .json({ msg: "Confirm password must be same as Password." });
    }

    const hashedPassword = await hash(password, 10);

    const accessToken = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        refreshToken,
      },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ msg: "User created successfully!", data: accessToken });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const findUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return res.status(401).json({ msg: "Wrong username or password." });
    }

    const passwordMatch = await compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: "Wrong username or password." });
    }

    const accessToken = jwt.sign(
      { username: existingUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: existingUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Guardar el nuevo refreshToken en la base de datos
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { refreshToken },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ msg: "Login successful!", data: accessToken });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });

    if (!user) return res.sendStatus(404); // User not found

    return res.json({ username: user.username });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.sendStatus(403); // Forbidden
  }
};

export const handleRefreshToken = async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.sendStatus(403);
  }
};

export const logoutUser = async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findUnique({
      where: { refreshToken },
    });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const userData = async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { refreshToken },
      include: { team: true }, // Include the 'team' relation
    });

    if (!existingUser) {
      return res.status(401).json({ msg: "No user found." });
    }

    const {
      password,
      refreshToken: _,
      ...userWithoutSensitiveFields
    } = existingUser;

    return res.status(200).json({ data: userWithoutSensitiveFields });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
