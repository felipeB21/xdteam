import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createNewTeam = async (req, res) => {
  const { name, img, region } = req.body;

  // Extract and decode the JWT token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  let username;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    username = decoded.username;
    if (!username) {
      throw new Error("Username not found in token");
    }
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }

  // Validate inputs
  if (!name || !img || !region) {
    return res.status(400).json({ msg: "All inputs are required!" });
  }

  if (name.length < 3) {
    return res.status(400).json({
      msg: "The team name must be 3 or more characters long!",
    });
  }

  const validImageFormats = ["jpg", "jpeg", "png", "gif"];
  const imgFormat = img.split(".").pop().toLowerCase();

  if (!validImageFormats.includes(imgFormat)) {
    return res.status(400).json({
      msg:
        "Invalid image format. Allowed formats are: " +
        validImageFormats.join(", "),
    });
  }

  try {
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam) {
      return res.status(400).json({ msg: "The team name is already in use." });
    }

    const team = await prisma.team.create({
      data: {
        name,
        img,
        region,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { username },
      data: { teamId: team.id },
    });

    return res.status(200).json({
      msg: "Team created successfully and user added to the team!",
      data: { team, user: updatedUser },
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
