import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import route from "./routes/route.js";
import { connecttoDB } from "./lib/db.js";
import usersroute from "./routes/userroute.js";
import chatRoutes from "./routes/chatroute.js";
import aiRoute from "./routes/aiRoute.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-frontend-ten-swart.vercel.app",
].map((o) => o.replace(/\/$/, "")); // Strip trailing slashes

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", route);
app.use("/api/users", usersroute);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoute);

const PORT = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI;

async function connecting() {
  try {
    await connecttoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("error connecting to db", error);
    process.exit(1);
  }
}
connecting();
