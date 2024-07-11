import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mime from "mime-types";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createNewTeam = async (req, res) => {
  const { name, region } = req.body;

  // Validar campos obligatorios
  if (!name || !region || !req.file) {
    return res.status(400).json({ msg: "All inputs are required!" });
  }

  // Validar longitud del nombre del equipo
  if (name.length < 3) {
    return res.status(400).json({
      msg: "The team name must be 3 or more characters long!",
    });
  }

  // Validar tipo de dato del nombre del equipo
  if (typeof name !== "string") {
    return res.status(400).json({
      msg: "The team name must be a string!",
    });
  }

  // Extraer y decodificar el token JWT del encabezado de autorización
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." });
  }

  let username;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    username = decoded.username;
    if (!username) {
      throw new Error("Username not found in token.");
    }
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid." });
  }

  try {
    // Verificar si el usuario ya pertenece a un equipo
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser.teamId) {
      return res.status(400).json({
        msg: "You already belong to a team. Cannot create another team.",
      });
    }

    // Verificar si el nombre del equipo ya está en uso
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam) {
      return res.status(400).json({ msg: "The team name is already in use." });
    }

    // Validar el tipo de imagen
    const mimeType = mime.lookup(req.file.originalname);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(mimeType)) {
      return res.status(400).json({
        msg: "Invalid image format. Please upload a JPEG, PNG, or GIF image.",
      });
    }

    // Subir la imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "team_images",
          public_id: `${Date.now()}-${req.file.originalname}`,
          format: "png",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const img = result.secure_url;

    // Crear el equipo en la base de datos
    const team = await prisma.team.create({
      data: {
        name,
        img,
        region,
        leaderUsername: username,
      },
    });

    // Actualizar el usuario para asignarlo al nuevo equipo
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { teamId: team.id },
      select: { id: true, username: true, teamId: true },
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

    // Actualizar cada equipo con su respectivo líder
    const updatedTeams = await Promise.all(
      teams.map(async (team) => {
        if (team.players.length > 0) {
          const leaderUsername = team.players[0].username;
          await prisma.team.update({
            where: { id: team.id },
            data: { leaderUsername },
          });
        } else {
          await prisma.team.delete({
            where: { id: team.id },
          });
        }
        return team;
      })
    );

    return res.status(200).json({ data: updatedTeams });
  } catch (error) {
    console.error("Error finding teams:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTeam = async (req, res) => {
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

  const teamToDelete = req.params.name; // Assuming you pass team name as a route parameter

  try {
    // Find the user to check their team and leadership status
    const user = await prisma.user.findUnique({
      where: { username },
      include: { team: true }, // Include the team information
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (
      !user.team ||
      user.team.name !== teamToDelete ||
      user.team.leaderUsername !== username
    ) {
      return res
        .status(403)
        .json({ msg: "User is not authorized to delete this team" });
    }

    // Delete the team
    await prisma.team.delete({
      where: { name: teamToDelete },
    });

    return res.status(200).json({ msg: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getTeamByName = async (req, res) => {
  const { name } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { name },
      include: {
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!team)
      return res
        .status(404)
        .json({ msg: "This team does'n exists. Try again wih other team!" });

    return res.status(200).json({ data: team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const intOfTeams = async (req, res) => {
  try {
    const teamCount = await prisma.team.count();
    if (!teamCount) return res.status(201).json({ msg: "No team founded" });
    return res.status(200).json({ count: teamCount });
  } catch (error) {
    console.error("Error fetching team count:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
