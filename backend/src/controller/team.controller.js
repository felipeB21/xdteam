import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createNewTeam = async (req, res) => {
  const { name, img, region } = req.body;

  // Extraer y decodificar el token JWT del encabezado de autorización
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

  // Validar entradas
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
    // Verificar si el usuario ya está en un equipo
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser.teamId) {
      return res.status(400).json({
        msg: "User already belongs to a team. Cannot create another team.",
      });
    }

    // Verificar si el nombre del equipo ya está en uso
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam) {
      return res.status(400).json({ msg: "The team name is already in use." });
    }

    // Crear el nuevo equipo
    const team = await prisma.team.create({
      data: {
        name,
        img,
        region,
      },
    });

    // Actualizar al usuario para asignarlo al nuevo equipo
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

export const leaveTeam = async (req, res) => {
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

  try {
    // Buscar al usuario para obtener su equipo actual
    const user = await prisma.user.findUnique({
      where: { username },
      include: { team: true }, // Incluir la relación con el equipo
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.team) {
      return res.status(400).json({ msg: "User is not in any team" });
    }

    // Actualizar al usuario para eliminar la asociación con el equipo
    await prisma.user.update({
      where: { id: user.id },
      data: { teamId: null }, // Asignar teamId como null para abandonar el equipo
    });

    return res.status(200).json({
      msg: "User successfully left the team",
    });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!teams || teams.length === 0) {
      return res.status(404).json({ msg: "No teams found" });
    }

    return res.status(200).json({ data: teams });
  } catch (error) {
    console.error("Error finding teams:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
