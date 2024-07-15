import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

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

  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      if (!decoded) return res.sendStatus(400);
      const user = await prisma.user.findUnique({
        where: { username: decoded.username },
      });
      if (!user) return res.sendStatus(404); // User not found

      return res.json({ username: user.username });
    });
  } catch (error) {
    console.error("Error verifying token:", error);

    return res.sendStatus(403); // Forbidden
  } finally {
    await prisma.$disconnect();
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

export const findUserByParams = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        team: true,
        ubiId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const intOfUsers = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    if (!userCount) return res.status(201).json({ msg: "No user founded" });
    return res.status(200).json({ count: userCount });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const ubiUserApi = async (req, res) => {
  const { username } = req.params;
  if (!username) return res.status(404).json({ data: "User not found!" });
  const url = `https://api.tracker.gg/api/v2/xdefiant/standard/profile/ubi/${username}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookies: [
          "X-Mapping-Server=s20; path=/; Secure; SameSite=None",
          "__cf_bm=jdWOlSCkI5D9x3zPX8RvlS3c3a9rp_XXUnPoTt8mlA4-1720807768-1.0.1.1-eLwT8bat5gsUz.9_LLGgu9dG6BvCa_43y72JJpVaT_3wl1MQ17KGsDHJ2OGjkez0BzAdzc7xx4UboWZG1Qo7fR6W3QZjqlmS9hgm12M.66Q; path=/; expires=Fri, 12-Jul-24 18:39:28 GMT; domain=.tracker.gg; HttpOnly; Secure; SameSite=None",
          "__cflb=02DiuFQAkRrzD1P1mdkJhfdTc9AmTWwYk2D6terap4uTA; SameSite=None; Secure; path=/; expires=Sat, 13-Jul-24 18:09:28 GMT; HttpOnly",
          "__eoi=ID=25c9c7ebaa8503f8:T=1720808397:RT=1720808397:S=AA-AfjaUIRv-Dyx02FjpCD9Azjcy",
          "__gads=ID=dec63ee1bad14c11:T=1720808397:RT=1720808397:S=ALNI_MZ8Qdxnw1alMkqbklM3G_cYBW7bKw",
          "__gpi=UID=00000a3f234aea1a:T=1720808397:RT=1720808397:S=ALNI_MY6f9q4dJnPWsGhu6jf1zMZbiWHQw",
          "__ga=GA1.1.1902982727.1720808428",
          "_ga_HWSV72GK8X=GS1.1.1720808427.1.1.1720808511.0.0.0",
          "_sharedid=ef2c9b54-f540-41be-bdd1-8878ba07d9d5",
          "cf_clearance=TWMpSnVQZUgo8PMibDFYA5kb9dEVKtmhoyEgc1LQHqE-1720808427-1.0.1.1-NdRqnCRT9xjCPtatsDZS8np.0r9s3xmX8o71gQ6kAOdtka.VAQ2NxHNqG.uWBtsPRpIZrAi_OtYpXzbyZn5Crg",
          "cto_bidid=ZjwJkF9GWU8xcENrYktPMFdZQjRKVXl4S2F1dGxoTjBBOTRKb3RPTllkJTJGc3BQJTJCJTJCYXBWeGVYQzJTenpvdmNiUHlZTEc5aUJyazYxMnhCalhTQ0lWeWJCc3RZMU5sTEZ2YWJDWTFtTVJwM2xnMlZUTSUzRA",
          "cto_bundle=dwERnV94c3RvOTIwWFFXUzVOYnhUSnhyUzhLODluVm1IV2lzMlY3R3dXSmw5U3VidVFJbjg0bVdpemZGOVo5Qkthb3JpMDdYYjQxJTJCMlhUQ0pTJTJCZnhlazNnREMzYjJSNkk5ekNYSzJ3Z1RIUHFtV09zYU0wJTJCaVNoS09NRldXTHZiTW83cUhUZlA5QXlWaUV5VDRiRnVEOTYxeUw1UWlDMlVLNkJMT29UMjVtNElXMm9maVIwcnBPQnl1YjFaZjFjejZEalhzayUyQnIxZiUyRkhpTUI3S2dxSDJTOHZTSnl1V0ZKdTRWVUdVJTJCYXpaOEp6bUx4MTM1TzljaFdxdUxXcHNIVlM2NVd6",
          "session_id=81e34dfc-015d-433e-a5fb-8207f26a1f72; expires=Fri, 12 Jul 2024 18:39:28 GMT; path=/",
        ],
      },
    });

    if (!response.ok) {
      return res.status(400).json({ msg: "Player not found" });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching Ubisoft user data" });
  } finally {
    await prisma.$disconnect();
  }
};

export const searchUserUbiByParams = async (req, res) => {
  const { query } = req.query;
  if (!query)
    return res.status(400).json({ error: "Query parameter is required" });

  const url = `https://api.tracker.gg/api/v2/xdefiant/standard/search?platform=ubi&query=${query}&autocomplete=true`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookies: [
          "X-Mapping-Server=s20; path=/; Secure; SameSite=None",
          "__cf_bm=jdWOlSCkI5D9x3zPX8RvlS3c3a9rp_XXUnPoTt8mlA4-1720807768-1.0.1.1-eLwT8bat5gsUz.9_LLGgu9dG6BvCa_43y72JJpVaT_3wl1MQ17KGsDHJ2OGjkez0BzAdzc7xx4UboWZG1Qo7fR6W3QZjqlmS9hgm12M.66Q; path=/; expires=Fri, 12-Jul-24 18:39:28 GMT; domain=.tracker.gg; HttpOnly; Secure; SameSite=None",
          "__cflb=02DiuFQAkRrzD1P1mdkJhfdTc9AmTWwYk2D6terap4uTA; SameSite=None; Secure; path=/; expires=Sat, 13-Jul-24 18:09:28 GMT; HttpOnly",
          "__eoi=ID=25c9c7ebaa8503f8:T=1720808397:RT=1720808397:S=AA-AfjaUIRv-Dyx02FjpCD9Azjcy",
          "__gads=ID=dec63ee1bad14c11:T=1720808397:RT=1720808397:S=ALNI_MZ8Qdxnw1alMkqbklM3G_cYBW7bKw",
          "__gpi=UID=00000a3f234aea1a:T=1720808397:RT=1720808397:S=ALNI_MY6f9q4dJnPWsGhu6jf1zMZbiWHQw",
          "__ga=GA1.1.1902982727.1720808428",
          "_ga_HWSV72GK8X=GS1.1.1720808427.1.1.1720808511.0.0.0",
          "_sharedid=ef2c9b54-f540-41be-bdd1-8878ba07d9d5",
          "cf_clearance=TWMpSnVQZUgo8PMibDFYA5kb9dEVKtmhoyEgc1LQHqE-1720808427-1.0.1.1-NdRqnCRT9xjCPtatsDZS8np.0r9s3xmX8o71gQ6kAOdtka.VAQ2NxHNqG.uWBtsPRpIZrAi_OtYpXzbyZn5Crg",
          "cto_bidid=ZjwJkF9GWU8xcENrYktPMFdZQjRKVXl4S2F1dGxoTjBBOTRKb3RPTllkJTJGc3BQJTJCJTJCYXBWeGVYQzJTenpvdmNiUHlZTEc5aUJyazYxMnhCalhTQ0lWeWJCc3RZMU5sTEZ2YWJDWTFtTVJwM2xnMlZUTSUzRA",
          "cto_bundle=dwERnV94c3RvOTIwWFFXUzVOYnhUSnhyUzhLODluVm1IV2lzMlY3R3dXSmw5U3VidVFJbjg0bVdpemZGOVo5Qkthb3JpMDdYYjQxJTJCMlhUQ0pTJTJCZnhlazNnREMzYjJSNkk5ekNYSzJ3Z1RIUHFtV09zYU0wJTJCaVNoS09NRldXTHZiTW83cUhUZlA5QXlWaUV5VDRiRnVEOTYxeUw1UWlDMlVLNkJMT29UMjVtNElXMm9maVIwcnBPQnl1YjFaZjFjejZEalhzayUyQnIxZiUyRkhpTUI3S2dxSDJTOHZTSnl1V0ZKdTRWVUdVJTJCYXpaOEp6bUx4MTM1TzljaFdxdUxXcHNIVlM2NVd6",
          "session_id=81e34dfc-015d-433e-a5fb-8207f26a1f72; expires=Fri, 12 Jul 2024 18:39:28 GMT; path=/",
        ],
      },
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching Ubisoft user data" });
  } finally {
    await prisma.$disconnect();
  }
};

export const setUbiId = async (req, res) => {
  const { ubiId } = req.body;
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        ubiId: true,
      },
    });

    if (!user) return res.status(400).json({ msg: "Invalid user." });
    if (!ubiId)
      return res.status(400).json({ msg: "The Ubisoft ID can't be empty." });
    if (user.ubiId === ubiId)
      return res
        .status(400)
        .json({ msg: "This Ubisoft account is already claimed." });

    const setId = await prisma.user.update({
      where: { username },
      data: { ubiId },
      select: {
        id: true,
        username: true,
        ubiId: true,
      },
    });

    res.status(200).json({ msg: "Ubisoft ID updated successfully.", setId });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
};
