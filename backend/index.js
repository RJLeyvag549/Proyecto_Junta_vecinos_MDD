"use strict"

import cors from "cors";
import express from "express";
import morgan from "morgan";
import indexRoutes from "./src/routes/index.routes.js";
import { PORT, HOST } from "./src/config/configEnv.js";
import { connectDB } from "./src/config/configDb.js";
import { createUsers } from "./src/config/initDb.js";

async function setupServer() {

  const app = express();
  app.disable("x-powered-by");

  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );

  app.use(express.json());

  app.use(morgan("dev"));

  app.use("/api", indexRoutes);

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  });
}

async function setupAPI() {
  try {

    await connectDB();

    await createUsers();

    await setupServer();
  } catch (error) {
    console.error("Error en index.js -> setupAPI(): ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(): ", error));
