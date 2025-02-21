const express = require("express")
const fs = require("fs")
const path = require("path")
const app = require("./app")
const pool = require("./src/config/db")
require("dotenv").config({ path: require("path").resolve(__dirname, "./.env") })

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  const uploadDir = path.join(__dirname, "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    console.log("La carpeta public/uploads no existe. Creándola...");
    fs.mkdirSync(uploadDir, { recursive: true });
  } else {
    console.log("La carpeta public/uploads ya existe");
  }
  app.use("/uploads", express.static(uploadDir));
}
const testDatabaseConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()")
    console.log("Conectado a PostgreSQL en:", res.rows[0].now)
  } catch (error) {
    console.error("Error conectando a PostgreSQL:", error)
    process.exit(1);
  }
}

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}

startServer()


